import {
  Duration,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_sns as sns,
  aws_events as events,
} from 'aws-cdk-lib';
import { LogLevelDesc } from 'loglevel';

export const DEFAULT_LOG_LEVEL: LogLevelDesc = 'info';

export const ASG_CAPACITY = 1;
export const DEFAULT_INSTANCE_TYPE_IDENTIFIER = 'c6gn.8xlarge';
export const USERDATA_CONFIG_FILE = '/etc/alternat.conf';
export const USERDATA_SCRIPT = '../scripts/alternat.sh';

export const DEFAULT_MAX_INSTANCE_LIFETIME: Duration = Duration.days(14);

export const DEFAULT_MACHINE_IMAGE = ec2.MachineImage.latestAmazonLinux({
  generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  cpuType: ec2.AmazonLinuxCpuType.ARM_64,
});

export const DefaultAlterNatProps = {
  ami: DEFAULT_MACHINE_IMAGE,
};

export const DESCRIBE_ROUTE_PERMISSIONS: iam.PolicyStatementProps = {
  sid: 'alterNATDescribeRoutePermissions',
  actions: ['ec2:DescribeRouteTables'],
  resources: ['*'],
};
export const MODIFY_INSTANCE_ATTR_PERMISSIONS: iam.PolicyStatementProps = {
  sid: 'alterNATInstancePermissions',
  actions: ['ec2:ModifyInstanceAttribute'],
  resources: ['*'],
  conditions: {
    StringEquals: {
      'aws:ResourceTag/alterNATInstance': ['true'],
    },
  },
};

export const EC2_ADDRESS_PERMISSIONS: iam.PolicyStatementProps = {
  sid: 'alterNATEIPPermissions',
  actions: ['ec2:DescribeAddresses', 'ec2:AssociateAddress'],
  resources: ['*'],
};

export const NAT_DESCRIBE_PERMISSIONS: iam.PolicyStatementProps = {
  sid: 'alterNATDescribePermissions',
  actions: [
    'ec2:DescribeNatGateways',
    'ec2:DescribeRouteTables',
    'ec2:DescribeSubnets',
    'autoscaling:DescribeAutoScalingGroups',
  ],
  resources: ['*'],
};

export const EBS_VOLUME_DEVICE_NAME = '/dev/sda1';

export const EBS_VOLUME_SIZE = 50;

export const EBS_VOLUME_OPTIONS: ec2.EbsDeviceOptions = {
  encrypted: true,
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  deleteOnTermination: true,
};

export const EBS_BLOCK_DEVICE: ec2.BlockDevice = {
  deviceName: EBS_VOLUME_DEVICE_NAME,
  volume: ec2.BlockDeviceVolume.ebs(EBS_VOLUME_SIZE, EBS_VOLUME_OPTIONS),
};

export const SNS_TOPIC_PROPERTIES: sns.TopicProps = {
  displayName: 'alterNATLifecycleHookTopic',
};

export const DEFAULT_HEARTBEAT_TIMEOUT: Duration = Duration.minutes(3);

export const LAMBDA_FUNCTION_TIMEOUT: Duration = Duration.minutes(10);

export const LAMBDA_FUNCTION_MEMORY_SIZE = 256;

export const DEFAULT_CONNECTIVITY_CHECK_URLS = [
  'https://www.example.com',
  'https://www.google.com',
];

export const EVERY_MINUTE: events.Schedule =
  events.Schedule.expression('rate(1 minute)');

export const CONNECTIVITY_CHECK_FUNCTION_HANDLER =
  'app.connectivity_test_handler';
