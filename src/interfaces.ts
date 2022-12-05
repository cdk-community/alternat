import {
  Duration,
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_ecr as ecr,
} from 'aws-cdk-lib';

export interface AlterNatProps {
  /**
   * An ECR repository containing the alterNAT container image.
   */
  readonly alterNatLambdaImageRepo: ecr.IRepository;
  /**
   * The tag of the alterNAT Lambda container image.
   */
  readonly alterNatLambdaImageTag: string;
  /**
   * The ami to use for the NAT instances
   *
   * @default - Amazon Linux latest.
   */
  readonly ami?: ec2.IMachineImage;
  /**
   * A list of URLs to use for checking connectivity through the NAT instances.
   *
   * @default - ["www.example.com", "www.google.com"]
   */
  readonly connectivityCheckUrls?: string[];
  /**
   * Whether to create a VPC Endpoint to EC2. If false, you must create the VPC
   * endpoint separately.
   *
   * @default - Create an EC2 VPC endpoint.
   */
  readonly createEc2Endpoint?: boolean;
  /**
   * Whether to create a VPC Endpoint to Lambda. If false, you must create the VPC
   * endpoint separately.
   *
   * @default - Create a Lambda VPC endpoint.
   */
  readonly createLambdaEndpoint?: boolean;
  /**
   * Whether to enable SSM on the NAT instances by attaching the AmazonSSMManagedInstanceCore
   * managed policy.
   *
   * @default - False.
   */
  readonly enableSsm?: boolean;
  /**
   * A list of NAT Gateway EIPs. Only used if the natGateways property is an empty
   * list.
   *
   * @default - Create new EIPs for the standby NAT Gateways.
   */
  readonly gatewayEips?: ec2.CfnEIP[];
  /**
   * The IAM Role to associate with the NAT instances.
   *
   * @default - Creates a new IAM role.
   */
  readonly iamRole?: iam.IRole;
  /**
   * A list of CIDR ranges to allow in the NAT instance security group.
   */
  readonly ingressCidrRanges?: string[];
  /**
   * A list of security groups to allow in the NAT instance security group.
   */
  readonly ingressSecurityGroups?: ec2.ISecurityGroup[];
  /**
   * A list of EIPs for the NAT instances to use.
   *
   * @default - Create new EIPs for the NAT instances.
   */
  readonly instanceEips?: ec2.CfnEIP[];
  /**
   * The EC2 instance type to use for the NAT instances.
   *
   * @default - c6gn.8xlarge
   */
  readonly instanceType?: ec2.InstanceType;
  /**
   * The amount of time to wait in the EC2 instance terminating state (e.g. in between
   * NAT instance termination and a new NAT instance in the Auto Scaling Group).
   *
   * @default - 3 minutes.
   */
  readonly lifecycleHeartbeatTimeout?: Duration;
  /**
   * The maximum lifetime to set for instances in the NAT instances Auto Scaling
   * Groups. When this value is reached, the instance will be terminated, a
   * lifecycle hook will fire to swap the route to the standby NAT Gateway, and a
   * new instance will boot and provision itself.
   *
   * https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html
   *
   * @default - 14 days.
   */
  readonly maxInstanceLifetime?: Duration;
  /**
   * A list of NAT gateways to use on standby.
   *
   * @default - Create new NAT gateways.
   */
  readonly natGateways?: ec2.CfnNatGateway[];
  /**
   * The private subnets that should route through the NAT instances.
   *
   * @default - Discover all private subnets in the VPC.
   */
  readonly privateSubnetsSelection?: ec2.SubnetSelection;
  /**
   * The public subnets in which the NAT instances should be placed.
   *
   * @default - Discover the public subnets in the VPC.
   */
  readonly publicSubnetsSelection?: ec2.SubnetSelection;
  /**
   * The Security Group in which to place the NAT instances.
   *
   * @default - Create a new security group with all outbound traffic allowed and
   * no inbound traffic allowed. See the ingressSecurityGroups and ingressCidrRanges
   * properties.
   */
  readonly securityGroup?: ec2.ISecurityGroup;
  /**
   * The vpc in which to provision the alterNAT instances and related resources.
   */
  readonly vpc: ec2.IVpc;
}
