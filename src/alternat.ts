import { readFileSync } from 'fs';
import * as path from 'path';
import {
  Stack,
  Tags,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_sns as sns,
  aws_autoscaling as autoscaling,
  aws_autoscaling_hooktargets as hooktargets,
  aws_lambda as lambda,
  aws_events as events,
  aws_sns_subscriptions as subs,
  aws_events_targets as targets,
  Duration,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import log, { LogLevelNames } from 'loglevel';
import * as constants from './constants';
import { AlterNatProps } from './interfaces';

interface Environment {
  [index: string]: string;
}

export class AlterNat extends Construct {
  private lambdaRole!: iam.Role;
  private lifecycleHookRole!: iam.Role;
  private privateSubnets!: ec2.SelectedSubnets;
  private publicSubnets!: ec2.SelectedSubnets;
  private launchTemplates: ec2.LaunchTemplate[] = [];
  private userData!: ec2.MultipartUserData;
  private privateRouteTableMap!: Map<string, string[]>;
  readonly props: AlterNatProps;
  private ami!: ec2.IMachineImage;
  private gatewayEips!: ec2.CfnEIP[];
  private iamRole!: iam.IRole;
  private instanceEips!: ec2.CfnEIP[];
  private instanceType!: ec2.InstanceType;
  private maxInstanceLifetime!: Duration;
  private natGateways!: ec2.CfnNatGateway[];
  private securityGroup?: ec2.ISecurityGroup;
  private snsTopic!: sns.Topic;

  constructor(scope: Construct, id: string, props: AlterNatProps) {
    super(scope, id);
    const logLevel =
      (process.env.LOG_LEVEL as LogLevelNames) ?? constants.DEFAULT_LOG_LEVEL;
    log.setLevel(logLevel);

    this.props = props;
    this.configureAmi();
    this.configureSecurityGroup();
    this.configurePrivateSubnets();
    this.configurePublicSubnets();
    this.configureIamRole();
    this.configureNatInstanceEips();
    if (!this.props.natGateways) {
      this.configureNatGateways();
    }
    this.configureInstanceType();
    this.configureInstanceLifetime();
    this.configureEndpoints();
    this.configureSnsTopic();
    this.configureAutoScalingGroup();
    this.configureLambdaRole();
    this.configureLifecycleHookFunc();
    this.configureConnectivityCheckFuncs();
  }

  private configureAmi() {
    this.ami = this.props.ami ?? constants.DEFAULT_MACHINE_IMAGE;
    if (this.ami?.getImage(this).osType !== ec2.OperatingSystemType.LINUX) {
      throw new Error('Must use a Linux AMI.');
    }
  }

  private configureSecurityGroup() {
    this.securityGroup =
      this.props.securityGroup ??
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: this.props.vpc,
        description: 'alterNAT instances security group',
        allowAllOutbound: true,
      });

    if (this.props.ingressSecurityGroups) {
      for (const _sg of this.props.ingressSecurityGroups) {
        this.securityGroup.addIngressRule(
          ec2.Peer.securityGroupId(_sg.securityGroupId),
          ec2.Port.allTraffic()
        );
      }
    }

    if (this.props.ingressCidrRanges) {
      for (const cidr of this.props.ingressCidrRanges) {
        this.securityGroup.addIngressRule(
          ec2.Peer.ipv4(cidr),
          ec2.Port.allTraffic()
        );
      }
    }
  }

  private configurePublicSubnets() {
    try {
      this.publicSubnets = this.props.vpc.selectSubnets(
        this.props.publicSubnetsSelection ?? {
          subnetType: ec2.SubnetType.PUBLIC,
          onePerAz: true,
        }
      );
    } catch (e) {
      throw new Error(
        'NAT devices must use public subnets. There must be one subnet per AZ.'
      );
    }
  }

  private configurePrivateSubnets() {
    try {
      this.privateSubnets = this.props.vpc.selectSubnets(
        this.props.privateSubnetsSelection ?? {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          onePerAz: true,
        }
      );
    } catch (e) {
      throw new Error('You must select one private subnet per AZ.');
    }

    this.privateRouteTableMap = this.privateSubnets.subnets.reduce(
      (routeMap, subnet) => {
        if (routeMap.has(subnet.availabilityZone)) {
          routeMap
            .get(subnet.availabilityZone)
            ?.push(subnet.routeTable.routeTableId);
        } else {
          routeMap.set(subnet.availabilityZone, [
            subnet.routeTable.routeTableId,
          ]);
        }
        return routeMap;
      },
      new Map<string, string[]>()
    );
  }

  private configureNatGateways() {
    this.gatewayEips =
      this.props.gatewayEips ??
      this.newEips('GatewayEIP', this.publicSubnets.subnets.length);

    if (this.gatewayEips.length !== this.publicSubnets.subnets.length) {
      throw new Error('Must provide an NAT Gateway EIP for each public subnet');
    }

    if (!this.natGateways) {
      this.natGateways = [];
      this.publicSubnets.subnets.forEach((subnet, index) => {
        this.natGateways.push(
          new ec2.CfnNatGateway(this, `natGateway${index}`, {
            subnetId: subnet.subnetId,
            allocationId: this.gatewayEips[index].attrAllocationId,
          })
        );
      });
    }
  }

  private configureNatInstanceEips() {
    this.instanceEips =
      this.props.instanceEips ??
      this.newEips('InstanceEIP', this.publicSubnets.subnets.length);

    if (this.instanceEips.length !== this.publicSubnets.subnets.length) {
      throw new Error(
        'Must provide an NAT instance EIP for each public subnet'
      );
    }
  }

  private configureIamRole() {
    this.iamRole =
      this.props.iamRole ??
      new iam.Role(this, 'IamRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

    if (this.props.enableSsm) {
      this.iamRole.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore'
        )
      );
    }
    this.iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement(constants.MODIFY_INSTANCE_ATTR_PERMISSIONS)
    );

    this.iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement(constants.DESCRIBE_ROUTE_PERMISSIONS)
    );

    this.iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement(constants.EC2_ADDRESS_PERMISSIONS)
    );

    const accountId = Stack.of(this).account;
    const region = Stack.of(this).region;
    let routeTableArns = [...this.privateRouteTableMap.values()]
      .flat()
      .map((rtId) => `arn:aws:ec2:${region}:${accountId}:route-table/${rtId}`);

    this.iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        sid: 'alterNATModifyRoutePermissions',
        actions: ['ec2:CreateRoute', 'ec2:ReplaceRoute'],
        resources: routeTableArns,
      })
    );
  }

  private configureInstanceType() {
    this.instanceType =
      this.props.instanceType ??
      new ec2.InstanceType(constants.DEFAULT_INSTANCE_TYPE_IDENTIFIER);
  }

  private configureInstanceLifetime() {
    this.maxInstanceLifetime =
      this.props.maxInstanceLifetime ?? constants.DEFAULT_MAX_INSTANCE_LIFETIME;
  }

  private configureEndpoints() {
    if (
      this.props.createEc2Endpoint === undefined ||
      this.props.createEc2Endpoint
    ) {
      this.interfaceVpcEndpoint(
        'Ec2VpcEndpoint',
        ec2.InterfaceVpcEndpointAwsService.EC2
      );
    }
    if (
      this.props.createLambdaEndpoint === undefined ||
      this.props.createLambdaEndpoint
    ) {
      this.interfaceVpcEndpoint(
        'LambdaVpcEndpoint',
        ec2.InterfaceVpcEndpointAwsService.LAMBDA
      );
    }
  }

  private interfaceVpcEndpoint(
    id: string,
    service: ec2.InterfaceVpcEndpointAwsService
  ) {
    new ec2.InterfaceVpcEndpoint(this, id, {
      service: service,
      vpc: this.props.vpc,
      lookupSupportedAzs: false,
      open: true,
      privateDnsEnabled: true,
      subnets: { subnets: this.privateSubnets.subnets },
    });
  }

  private configureAutoScalingGroup() {
    const instanceEipCsv = this.instanceEips
      .map((aId) => aId.attrAllocationId)
      .join(',');

    this.publicSubnets.subnets.forEach((subnet, index) => {
      this.configureLaunchTemplate(
        subnet.availabilityZone,
        instanceEipCsv,
        index
      );
      const asg = new autoscaling.AutoScalingGroup(this, `Asg${index}`, {
        vpc: this.props.vpc,
        minCapacity: constants.ASG_CAPACITY,
        maxCapacity: constants.ASG_CAPACITY,
        maxInstanceLifetime: this.maxInstanceLifetime,
        vpcSubnets: this.props.vpc.selectSubnets({ subnets: [subnet] }),
        launchTemplate: this.launchTemplates[index],
      });
      Tags.of(asg).add('alterNATInstance', 'true');
      this.configureLifecycleHook(asg, index);
    });
  }

  private configureLaunchTemplate(az: string, eipCsv: string, index: number) {
    this.configureUserData(az, eipCsv);
    this.launchTemplates.push(
      new ec2.LaunchTemplate(this, `LaunchTemplate-${index}`, {
        instanceType: this.instanceType,
        machineImage: this.ami,
        userData: this.userData,
        securityGroup: this.securityGroup,
        role: this.iamRole,
        blockDevices: [constants.EBS_BLOCK_DEVICE],
        detailedMonitoring: true,
        requireImdsv2: true,
        httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
      })
    );
  }

  private configureLifecycleHook(
    asg: autoscaling.IAutoScalingGroup,
    index: number
  ) {
    const topicHook = new hooktargets.TopicHook(this.snsTopic);
    if (!this.lifecycleHookRole) {
      this.lifecycleHookRole = new iam.Role(this, 'LifecycleHookRole', {
        assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
      });
    }

    const timeout =
      this.props.lifecycleHeartbeatTimeout ??
      constants.DEFAULT_HEARTBEAT_TIMEOUT;

    new autoscaling.LifecycleHook(this, `lifecycleHook${index}`, {
      heartbeatTimeout: timeout,
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      notificationTarget: topicHook,
      role: this.lifecycleHookRole,
      autoScalingGroup: asg,
    });
  }

  private configureSnsTopic() {
    this.snsTopic =
      this.props.snsTopic ??
      new sns.Topic(this, 'SnsTopic', constants.SNS_TOPIC_PROPERTIES);
  }

  private configureUserData(az: string, eipCsv: string) {
    const configUserData = ec2.UserData.forLinux();

    configUserData.addCommands(
      `echo "eip_allocation_ids_csv=${eipCsv}" >> ${constants.USERDATA_CONFIG_FILE}`
    );

    if (!this.privateRouteTableMap.has(az)) {
      throw new Error(`Could not find route table for zone ${az}.`);
    }
    const rtCsv = this.privateRouteTableMap.get(az)?.join(',');
    configUserData.addCommands(
      `echo "route_table_ids_csv=${rtCsv}" >> ${constants.USERDATA_CONFIG_FILE}`
    );

    const script = readFileSync(
      path.resolve(__dirname, constants.USERDATA_SCRIPT),
      'utf8'
    );
    const scriptUserData = ec2.UserData.custom(script);

    this.userData = new ec2.MultipartUserData();
    this.userData.addPart(ec2.MultipartBody.fromUserData(configUserData));
    this.userData.addPart(ec2.MultipartBody.fromUserData(scriptUserData));
  }

  private newEips(desc: string, num: number): ec2.CfnEIP[] {
    const _eips: ec2.CfnEIP[] = [];
    for (let i = 0; i < num; i++) {
      _eips.push(
        new ec2.CfnEIP(this, `alterNAT${desc}${i}`, {
          domain: 'vpc',
        })
      );
    }
    return _eips;
  }

  private configureConnectivityCheckFuncs() {
    const sg = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.props.vpc,
      description: 'alterNAT lambda connectivity test security group',
      allowAllOutbound: true,
    });

    const everyMinuteRule = new events.Rule(this, 'EveryMinuteRule', {
      schedule: constants.EVERY_MINUTE,
    });

    const environment: Environment = {};
    environment.CHECK_URLS =
      this.props.connectivityCheckUrls?.join(',') ??
      constants.DEFAULT_CONNECTIVITY_CHECK_URLS.join(',');

    let index = 0;
    this.privateRouteTableMap.forEach((rts, az) => {
      environment.ROUTE_TABLE_IDS_CSV = rts.join(',');

      let publicSubnetId = '';
      this.publicSubnets.subnets.forEach((subnet) => {
        if (subnet.availabilityZone === az) {
          publicSubnetId = subnet.subnetId;
        }
      });
      environment.PUBLIC_SUBNET_ID = publicSubnetId;

      const privateSubnets: ec2.SelectedSubnets = this.props.vpc.selectSubnets({
        availabilityZones: [az],
      });

      let func = new lambda.DockerImageFunction(
        this,
        `ConnectivityCheckFunction${index}`,
        {
          code: lambda.DockerImageCode.fromEcr(
            this.props.alterNatLambdaImageRepo,
            {
              tagOrDigest: this.props.alterNatLambdaImageTag,
              cmd: [constants.CONNECTIVITY_CHECK_FUNCTION_HANDLER],
            }
          ),
          environment: environment,
          memorySize: constants.LAMBDA_FUNCTION_MEMORY_SIZE,
          role: this.lambdaRole,
          securityGroups: [sg],
          timeout: constants.LAMBDA_FUNCTION_TIMEOUT,
          vpc: this.props.vpc,
          vpcSubnets: privateSubnets,
        }
      );
      everyMinuteRule.addTarget(new targets.LambdaFunction(func));
      new lambda.CfnPermission(this, `AllowEvents${index}`, {
        action: 'lambda:InvokeFunction',
        functionName: func.functionArn,
        principal: 'events.amazonaws.com',
        sourceArn: everyMinuteRule.ruleArn,
      });
      index += 1;
    });
  }

  private configureLifecycleHookFunc() {
    const environment: Environment = {};
    this.privateRouteTableMap.forEach((rts, az) => {
      environment[az.toUpperCase().split('-').join('_')] = rts.join(',');
    });

    const lifecycleLambda = new lambda.DockerImageFunction(
      this,
      'LifecycleHookFunction',
      {
        code: lambda.DockerImageCode.fromEcr(
          this.props.alterNatLambdaImageRepo,
          {
            tagOrDigest: this.props.alterNatLambdaImageTag,
          }
        ),
        environment: environment,
        memorySize: constants.LAMBDA_FUNCTION_MEMORY_SIZE,
        role: this.lambdaRole,
        timeout: constants.LAMBDA_FUNCTION_TIMEOUT,
      }
    );
    const allowSnsPermission = new lambda.CfnPermission(this, 'AllowSns', {
      action: 'lambda:InvokeFunction',
      functionName: lifecycleLambda.functionArn,
      principal: 'sns.amazonaws.com',
      sourceArn: this.snsTopic.topicArn,
    });
    allowSnsPermission.node.addDependency(lifecycleLambda);
    this.snsTopic.addSubscription(new subs.LambdaSubscription(lifecycleLambda));
  }

  private configureLambdaRole() {
    this.lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    this.lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole'
      )
    );
    this.lambdaRole.addToPrincipalPolicy(
      new iam.PolicyStatement(constants.NAT_DESCRIBE_PERMISSIONS)
    );

    const routeTables: string[] = [];
    const accountId = Stack.of(this).account;
    const region = Stack.of(this).region;
    this.privateRouteTableMap.forEach((rts) => {
      rts.forEach((rt) =>
        routeTables.push(`arn:aws:ec2:${region}:${accountId}:route-table/${rt}`)
      );
    });
    this.lambdaRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        sid: 'alterNATModifyRoutePermissions',
        actions: ['ec2:ReplaceRoute'],
        resources: routeTables,
      })
    );
  }
}
