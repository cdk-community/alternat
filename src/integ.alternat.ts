import { App, Stack, aws_ec2 as ec2, aws_ecr as ecr } from 'aws-cdk-lib';
import { AlterNat } from './alternat';

const app = new App();
const stack = new Stack(app, 'AlterNatStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

const vpc = new ec2.Vpc(stack, 'Vpc', {
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

const alterNatProps = {
  vpc: vpc,
  instanceType: new ec2.InstanceType('c6gn.medium'),
  enableSsm: true,
  alterNatLambdaImageRepo: ecr.Repository.fromRepositoryName(
    stack,
    'alterNatEcrRepo',
    'alternat'
  ),
  alterNatLambdaImageTag: 'v0.2.1',
  ingressCidrRanges: [vpc.vpcCidrBlock],
};

new AlterNat(stack, 'alterNat', alterNatProps);

app.synth();
