import {
  Stack,
  aws_ec2 as ec2,
  aws_autoscaling as autoscaling,
  aws_ecr as ecr,
} from 'aws-cdk-lib';
import { Template, Capture, Match } from 'aws-cdk-lib/assertions';
import { AlterNat } from '../src/alternat';
import * as constants from '../src/constants';
import { AlterNatProps } from '../src/interfaces';

function getVpc(stack: Stack): ec2.Vpc {
  return new ec2.Vpc(stack, 'Vpc', {
    natGateways: 0,
    subnetConfiguration: [
      {
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: 'PrivateWithNat1',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
      },
    ],
    vpcName: 'alterNATVPC',
  });
}

function getAlterNatProps(vpc: ec2.Vpc, stack: Stack): AlterNatProps {
  return {
    vpc: vpc,
    instanceType: new ec2.InstanceType('c6gn.medium'),
    enableSsm: true,
    alterNatLambdaImageRepo: ecr.Repository.fromRepositoryName(
      stack,
      'alterNatEcrRepo',
      'alternat'
    ),
    alterNatLambdaImageTag: 'alterNatVersion',
    ingressCidrRanges: [vpc.vpcCidrBlock],
  };
}

function setupAlterNatTemplate(
  stack?: Stack,
  vpc?: ec2.Vpc,
  props?: AlterNatProps
): Template {
  if (!stack) {
    stack = new Stack();
  }
  if (!vpc) {
    vpc = getVpc(stack);
  }
  if (!props) {
    props = getAlterNatProps(vpc, stack);
  }
  new AlterNat(stack, 'alterNatTest', props);
  const template = Template.fromStack(stack);
  return template;
}

describe('AlterNatStack', () => {
  const stack = new Stack();
  const vpc = getVpc(stack);
  const template = setupAlterNatTemplate(stack, vpc);

  test('correct resource counts', () => {
    const numZones = vpc.availabilityZones.length;
    template.resourceCountIs('AWS::EC2::SecurityGroup', 4);
    template.resourceCountIs('AWS::Lambda::Function', numZones + 1);
    template.resourceCountIs('AWS::Lambda::Permission', 6);
    template.resourceCountIs('AWS::SNS::Topic', 1);
    template.resourceCountIs('AWS::SNS::Subscription', 1);
    template.resourceCountIs('AWS::EC2::NatGateway', numZones);
    template.resourceCountIs('AWS::EC2::VPCEndpoint', 2);
    template.resourceCountIs('AWS::Events::Rule', 1);
    template.resourceCountIs('AWS::AutoScaling::AutoScalingGroup', numZones);
    template.resourceCountIs('AWS::AutoScaling::LifecycleHook', numZones);
    template.resourceCountIs('AWS::IAM::Role', 3);
    template.resourceCountIs('AWS::IAM::Policy', 3);
    template.resourceCountIs('AWS::IAM::InstanceProfile', numZones);
    template.resourceCountIs('AWS::EC2::EIP', numZones * 2);
    template.resourceCountIs('AWS::EC2::VPCEndpoint', 2);
    template.resourceCountIs('AWS::EC2::LaunchTemplate', numZones);
  });

  test('launch templates configured correctly', () => {
    template.hasResourceProperties('AWS::EC2::LaunchTemplate', {
      LaunchTemplateData: {
        BlockDeviceMappings: [
          {
            DeviceName: constants.DEFAULT_EBS_VOLUME_DEVICE_NAME,
            Ebs: {
              Encrypted: true,
              VolumeSize: constants.DEFAULT_EBS_VOLUME_SIZE,
              VolumeType: 'gp3',
            },
          },
        ],
        IamInstanceProfile: {
          Arn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('^alterNatTestLaunchTemplate'),
              'Arn',
            ],
          },
        },
        InstanceType: 'c6gn.medium',
        Monitoring: { Enabled: true },
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('^alterNatTestSecurityGroup'),
              'GroupId',
            ],
          },
        ],
      },
    });
  });

  test('lifecycle hook is configured correctly', () => {
    template.hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
      LifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      HeartbeatTimeout: constants.DEFAULT_HEARTBEAT_TIMEOUT.toSeconds(),
      NotificationTargetARN: {
        Ref: Match.stringLikeRegexp('^alterNatTestSnsTopic'),
      },
    });
  });

  test('lifecycle Lambda has correct env var keys', () => {
    const firstAzKey = vpc.privateSubnets[0].availabilityZone
      .toUpperCase()
      .split('-')
      .join('_');
    const secondAzKey = vpc.privateSubnets[1].availabilityZone
      .toUpperCase()
      .split('-')
      .join('_');
    const valCapture = new Capture();
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: { [firstAzKey]: valCapture, [secondAzKey]: valCapture },
      },
    });
  });
});
