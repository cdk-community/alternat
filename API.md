# alterNAT, CDK Edition

NAT Gateways are dead. Long live NAT instances!

This project is an AWS CDK implementation of [alterNAT](https://alternat.cloud) which comprises a Terraform module, a User Data boot script, and a Lambda function. This project reuses the Lambda function and User Data from the original project. See the sections below to learn how these fit together.

Please refer to [the upstream project README](https://github.com/1debit/alternat/blob/main/README.md) for many more details.

## Usage

See [`src/integ.alternat.ts`](/src/integ.alternat.ts) to get a general idea of how to use alternat-cdk.

The Lambda function is maintained as a Docker container in the upstream project. To use alternat-cdk:

1. Clone https://github.com/1debit/alternat
1. Follow its instructions to [build and push the container image](https://github.com/1debit/alternat/#building-and-pushing-the-container-image) (or do it your own way)
1. Now you can use alternat-cdk as shown in `integ.alternat.ts` using the image you just built.


## Limitations

* At present, alternat-cdk does not implement a `NatProvider`. Instead, as shown in [`src/integ.alternat.ts`](/src/integ.alternat.ts), set `natGateways: 0` when instantiating `ec2.Vpc` and allow alternat to manage the NAT gateways.
* The alterNAT security groups are not currently managed with [`Connections`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Connections.html). Instead, either pass the security group, or pass `ingressCidrRanges` and/or `ingressSecurityGroups` in the properties.
* For lack of a better way of doing it, [`scripts/alternat.sh`](/scripts/alternat.sh) is an exact copy of [the upstream equivalent](https://github.com/1debit/alternat/tree/main/scripts) file. Ideas welcome on how to include that file in alternat-cdk without duplicating it!

## Contributions

This project welcomes contributions! Please [submit an issue](https://github.com/1debit/alternat/issues) if you have an idea that you'd like to contribute. Contributors are expected to adhere to the [Contributor Covenant code of conduct](CODE_OF_CONDUCT.md).

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AlterNat <a name="AlterNat" id="alternat.AlterNat"></a>

#### Initializers <a name="Initializers" id="alternat.AlterNat.Initializer"></a>

```typescript
import { AlterNat } from 'alternat'

new AlterNat(scope: Construct, id: string, props: AlterNatProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#alternat.AlterNat.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#alternat.AlterNat.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#alternat.AlterNat.Initializer.parameter.props">props</a></code> | <code><a href="#alternat.AlterNatProps">AlterNatProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="alternat.AlterNat.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="alternat.AlterNat.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="alternat.AlterNat.Initializer.parameter.props"></a>

- *Type:* <a href="#alternat.AlterNatProps">AlterNatProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#alternat.AlterNat.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="alternat.AlterNat.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#alternat.AlterNat.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="alternat.AlterNat.isConstruct"></a>

```typescript
import { AlterNat } from 'alternat'

AlterNat.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="alternat.AlterNat.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#alternat.AlterNat.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="alternat.AlterNat.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### AlterNatProps <a name="AlterNatProps" id="alternat.AlterNatProps"></a>

#### Initializer <a name="Initializer" id="alternat.AlterNatProps.Initializer"></a>

```typescript
import { AlterNatProps } from 'alternat'

const alterNatProps: AlterNatProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#alternat.AlterNatProps.property.alterNatLambdaImageRepo">alterNatLambdaImageRepo</a></code> | <code>aws-cdk-lib.aws_ecr.IRepository</code> | An ECR repository containing the alterNAT container image. |
| <code><a href="#alternat.AlterNatProps.property.alterNatLambdaImageTag">alterNatLambdaImageTag</a></code> | <code>string</code> | The tag of the alterNAT Lambda container image. |
| <code><a href="#alternat.AlterNatProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The vpc in which to provision the alterNAT instances and related resources. |
| <code><a href="#alternat.AlterNatProps.property.ami">ami</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | The ami to use for the NAT instances. |
| <code><a href="#alternat.AlterNatProps.property.connectivityCheckUrls">connectivityCheckUrls</a></code> | <code>string[]</code> | A list of URLs to use for checking connectivity through the NAT instances. |
| <code><a href="#alternat.AlterNatProps.property.createEc2Endpoint">createEc2Endpoint</a></code> | <code>boolean</code> | Whether to create a VPC Endpoint to EC2. |
| <code><a href="#alternat.AlterNatProps.property.createLambdaEndpoint">createLambdaEndpoint</a></code> | <code>boolean</code> | Whether to create a VPC Endpoint to Lambda. |
| <code><a href="#alternat.AlterNatProps.property.enableSsm">enableSsm</a></code> | <code>boolean</code> | Whether to enable SSM on the NAT instances by attaching the AmazonSSMManagedInstanceCore managed policy. |
| <code><a href="#alternat.AlterNatProps.property.gatewayEips">gatewayEips</a></code> | <code>aws-cdk-lib.aws_ec2.CfnEIP[]</code> | A list of NAT Gateway EIPs. |
| <code><a href="#alternat.AlterNatProps.property.iamRole">iamRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The IAM Role to associate with the NAT instances. |
| <code><a href="#alternat.AlterNatProps.property.ingressCidrRanges">ingressCidrRanges</a></code> | <code>string[]</code> | A list of CIDR ranges to allow in the NAT instance security group. |
| <code><a href="#alternat.AlterNatProps.property.ingressSecurityGroups">ingressSecurityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | A list of security groups to allow in the NAT instance security group. |
| <code><a href="#alternat.AlterNatProps.property.instanceEips">instanceEips</a></code> | <code>aws-cdk-lib.aws_ec2.CfnEIP[]</code> | A list of EIPs for the NAT instances to use. |
| <code><a href="#alternat.AlterNatProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | The EC2 instance type to use for the NAT instances. |
| <code><a href="#alternat.AlterNatProps.property.lifecycleHeartbeatTimeout">lifecycleHeartbeatTimeout</a></code> | <code>aws-cdk-lib.Duration</code> | The amount of time to wait in the EC2 instance terminating state (e.g. in between NAT instance termination and a new NAT instance in the Auto Scaling Group). |
| <code><a href="#alternat.AlterNatProps.property.maxInstanceLifetime">maxInstanceLifetime</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum lifetime to set for instances in the NAT instances Auto Scaling Groups. |
| <code><a href="#alternat.AlterNatProps.property.natGateways">natGateways</a></code> | <code>aws-cdk-lib.aws_ec2.CfnNatGateway[]</code> | A list of NAT gateways to use on standby. |
| <code><a href="#alternat.AlterNatProps.property.privateSubnetsSelection">privateSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The private subnets that should route through the NAT instances. |
| <code><a href="#alternat.AlterNatProps.property.publicSubnetsSelection">publicSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The public subnets in which the NAT instances should be placed. |
| <code><a href="#alternat.AlterNatProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | The Security Group in which to place the NAT instances. |

---

##### `alterNatLambdaImageRepo`<sup>Required</sup> <a name="alterNatLambdaImageRepo" id="alternat.AlterNatProps.property.alterNatLambdaImageRepo"></a>

```typescript
public readonly alterNatLambdaImageRepo: IRepository;
```

- *Type:* aws-cdk-lib.aws_ecr.IRepository

An ECR repository containing the alterNAT container image.

---

##### `alterNatLambdaImageTag`<sup>Required</sup> <a name="alterNatLambdaImageTag" id="alternat.AlterNatProps.property.alterNatLambdaImageTag"></a>

```typescript
public readonly alterNatLambdaImageTag: string;
```

- *Type:* string

The tag of the alterNAT Lambda container image.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="alternat.AlterNatProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

The vpc in which to provision the alterNAT instances and related resources.

---

##### `ami`<sup>Optional</sup> <a name="ami" id="alternat.AlterNatProps.property.ami"></a>

```typescript
public readonly ami: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage
- *Default:* Amazon Linux latest.

The ami to use for the NAT instances.

---

##### `connectivityCheckUrls`<sup>Optional</sup> <a name="connectivityCheckUrls" id="alternat.AlterNatProps.property.connectivityCheckUrls"></a>

```typescript
public readonly connectivityCheckUrls: string[];
```

- *Type:* string[]
- *Default:* ["www.example.com", "www.google.com"]

A list of URLs to use for checking connectivity through the NAT instances.

---

##### `createEc2Endpoint`<sup>Optional</sup> <a name="createEc2Endpoint" id="alternat.AlterNatProps.property.createEc2Endpoint"></a>

```typescript
public readonly createEc2Endpoint: boolean;
```

- *Type:* boolean
- *Default:* Create an EC2 VPC endpoint.

Whether to create a VPC Endpoint to EC2.

If false, you must create the VPC
endpoint separately.

---

##### `createLambdaEndpoint`<sup>Optional</sup> <a name="createLambdaEndpoint" id="alternat.AlterNatProps.property.createLambdaEndpoint"></a>

```typescript
public readonly createLambdaEndpoint: boolean;
```

- *Type:* boolean
- *Default:* Create a Lambda VPC endpoint.

Whether to create a VPC Endpoint to Lambda.

If false, you must create the VPC
endpoint separately.

---

##### `enableSsm`<sup>Optional</sup> <a name="enableSsm" id="alternat.AlterNatProps.property.enableSsm"></a>

```typescript
public readonly enableSsm: boolean;
```

- *Type:* boolean
- *Default:* False.

Whether to enable SSM on the NAT instances by attaching the AmazonSSMManagedInstanceCore managed policy.

---

##### `gatewayEips`<sup>Optional</sup> <a name="gatewayEips" id="alternat.AlterNatProps.property.gatewayEips"></a>

```typescript
public readonly gatewayEips: CfnEIP[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnEIP[]
- *Default:* Create new EIPs for the standby NAT Gateways.

A list of NAT Gateway EIPs.

Only used if the natGateways property is an empty
list.

---

##### `iamRole`<sup>Optional</sup> <a name="iamRole" id="alternat.AlterNatProps.property.iamRole"></a>

```typescript
public readonly iamRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* Creates a new IAM role.

The IAM Role to associate with the NAT instances.

---

##### `ingressCidrRanges`<sup>Optional</sup> <a name="ingressCidrRanges" id="alternat.AlterNatProps.property.ingressCidrRanges"></a>

```typescript
public readonly ingressCidrRanges: string[];
```

- *Type:* string[]

A list of CIDR ranges to allow in the NAT instance security group.

---

##### `ingressSecurityGroups`<sup>Optional</sup> <a name="ingressSecurityGroups" id="alternat.AlterNatProps.property.ingressSecurityGroups"></a>

```typescript
public readonly ingressSecurityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

A list of security groups to allow in the NAT instance security group.

---

##### `instanceEips`<sup>Optional</sup> <a name="instanceEips" id="alternat.AlterNatProps.property.instanceEips"></a>

```typescript
public readonly instanceEips: CfnEIP[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnEIP[]
- *Default:* Create new EIPs for the NAT instances.

A list of EIPs for the NAT instances to use.

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="alternat.AlterNatProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* c6gn.8xlarge

The EC2 instance type to use for the NAT instances.

---

##### `lifecycleHeartbeatTimeout`<sup>Optional</sup> <a name="lifecycleHeartbeatTimeout" id="alternat.AlterNatProps.property.lifecycleHeartbeatTimeout"></a>

```typescript
public readonly lifecycleHeartbeatTimeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* 3 minutes.

The amount of time to wait in the EC2 instance terminating state (e.g. in between NAT instance termination and a new NAT instance in the Auto Scaling Group).

---

##### `maxInstanceLifetime`<sup>Optional</sup> <a name="maxInstanceLifetime" id="alternat.AlterNatProps.property.maxInstanceLifetime"></a>

```typescript
public readonly maxInstanceLifetime: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* 14 days.

The maximum lifetime to set for instances in the NAT instances Auto Scaling Groups.

When this value is reached, the instance will be terminated, a
lifecycle hook will fire to swap the route to the standby NAT Gateway, and a
new instance will boot and provision itself.

https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html

---

##### `natGateways`<sup>Optional</sup> <a name="natGateways" id="alternat.AlterNatProps.property.natGateways"></a>

```typescript
public readonly natGateways: CfnNatGateway[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnNatGateway[]
- *Default:* Create new NAT gateways.

A list of NAT gateways to use on standby.

---

##### `privateSubnetsSelection`<sup>Optional</sup> <a name="privateSubnetsSelection" id="alternat.AlterNatProps.property.privateSubnetsSelection"></a>

```typescript
public readonly privateSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Discover all private subnets in the VPC.

The private subnets that should route through the NAT instances.

---

##### `publicSubnetsSelection`<sup>Optional</sup> <a name="publicSubnetsSelection" id="alternat.AlterNatProps.property.publicSubnetsSelection"></a>

```typescript
public readonly publicSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Discover the public subnets in the VPC.

The public subnets in which the NAT instances should be placed.

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="alternat.AlterNatProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup
- *Default:* Create a new security group with all outbound traffic allowed and no inbound traffic allowed. See the ingressSecurityGroups and ingressCidrRanges properties.

The Security Group in which to place the NAT instances.

---



