import {
  Duration,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_sns as sns,
  aws_ecr as ecr,
} from 'aws-cdk-lib';

export interface AlterNatProps {
  readonly ami?: ec2.IMachineImage;
  readonly securityGroup?: ec2.ISecurityGroup;
  readonly iamRole?: iam.IRole;
  readonly maxInstanceLifetime?: Duration;
  readonly instanceType?: ec2.InstanceType;
  readonly instanceEips?: ec2.CfnEIP[];
  readonly gatewayEips?: ec2.CfnEIP[];
  readonly snsTopic?: sns.Topic;
  readonly natGateways?: ec2.CfnNatGateway[];
  readonly vpc: ec2.IVpc;
  readonly publicSubnetsSelection?: ec2.SubnetSelection;
  readonly privateSubnetsSelection?: ec2.SubnetSelection;
  readonly ingressSecurityGroups?: ec2.ISecurityGroup[];
  readonly ingressCidrRanges?: string[];
  readonly enableSsm?: boolean;
  readonly createEc2Endpoint?: boolean;
  readonly createLambdaEndpoint?: boolean;
  readonly lifecycleHeartbeatTimeout?: Duration;
  readonly alterNatLambdaImageRepo: ecr.IRepository;
  readonly alterNatLambdaImageTag: string;
  readonly connectivityCheckUrls?: string[];
}
