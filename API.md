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
| <code><a href="#alternat.AlterNat.property.props">props</a></code> | <code><a href="#alternat.AlterNatProps">AlterNatProps</a></code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="alternat.AlterNat.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `props`<sup>Required</sup> <a name="props" id="alternat.AlterNat.property.props"></a>

```typescript
public readonly props: AlterNatProps;
```

- *Type:* <a href="#alternat.AlterNatProps">AlterNatProps</a>

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
| <code><a href="#alternat.AlterNatProps.property.alterNatLambdaImageRepo">alterNatLambdaImageRepo</a></code> | <code>aws-cdk-lib.aws_ecr.IRepository</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.alterNatLambdaImageTag">alterNatLambdaImageTag</a></code> | <code>string</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.ami">ami</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.connectivityCheckUrls">connectivityCheckUrls</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.createEc2Endpoint">createEc2Endpoint</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.createLambdaEndpoint">createLambdaEndpoint</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.enableSsm">enableSsm</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.gatewayEips">gatewayEips</a></code> | <code>aws-cdk-lib.aws_ec2.CfnEIP[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.iamRole">iamRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.ingressCidrRanges">ingressCidrRanges</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.ingressSecurityGroups">ingressSecurityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.instanceEips">instanceEips</a></code> | <code>aws-cdk-lib.aws_ec2.CfnEIP[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.lifecycleHeartbeatTimeout">lifecycleHeartbeatTimeout</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.maxInstanceLifetime">maxInstanceLifetime</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.natGateways">natGateways</a></code> | <code>aws-cdk-lib.aws_ec2.CfnNatGateway[]</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.privateSubnetsSelection">privateSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.publicSubnetsSelection">publicSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#alternat.AlterNatProps.property.snsTopic">snsTopic</a></code> | <code>aws-cdk-lib.aws_sns.Topic</code> | *No description.* |

---

##### `alterNatLambdaImageRepo`<sup>Required</sup> <a name="alterNatLambdaImageRepo" id="alternat.AlterNatProps.property.alterNatLambdaImageRepo"></a>

```typescript
public readonly alterNatLambdaImageRepo: IRepository;
```

- *Type:* aws-cdk-lib.aws_ecr.IRepository

---

##### `alterNatLambdaImageTag`<sup>Required</sup> <a name="alterNatLambdaImageTag" id="alternat.AlterNatProps.property.alterNatLambdaImageTag"></a>

```typescript
public readonly alterNatLambdaImageTag: string;
```

- *Type:* string

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="alternat.AlterNatProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

---

##### `ami`<sup>Optional</sup> <a name="ami" id="alternat.AlterNatProps.property.ami"></a>

```typescript
public readonly ami: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage

---

##### `connectivityCheckUrls`<sup>Optional</sup> <a name="connectivityCheckUrls" id="alternat.AlterNatProps.property.connectivityCheckUrls"></a>

```typescript
public readonly connectivityCheckUrls: string[];
```

- *Type:* string[]

---

##### `createEc2Endpoint`<sup>Optional</sup> <a name="createEc2Endpoint" id="alternat.AlterNatProps.property.createEc2Endpoint"></a>

```typescript
public readonly createEc2Endpoint: boolean;
```

- *Type:* boolean

---

##### `createLambdaEndpoint`<sup>Optional</sup> <a name="createLambdaEndpoint" id="alternat.AlterNatProps.property.createLambdaEndpoint"></a>

```typescript
public readonly createLambdaEndpoint: boolean;
```

- *Type:* boolean

---

##### `enableSsm`<sup>Optional</sup> <a name="enableSsm" id="alternat.AlterNatProps.property.enableSsm"></a>

```typescript
public readonly enableSsm: boolean;
```

- *Type:* boolean

---

##### `gatewayEips`<sup>Optional</sup> <a name="gatewayEips" id="alternat.AlterNatProps.property.gatewayEips"></a>

```typescript
public readonly gatewayEips: CfnEIP[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnEIP[]

---

##### `iamRole`<sup>Optional</sup> <a name="iamRole" id="alternat.AlterNatProps.property.iamRole"></a>

```typescript
public readonly iamRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

---

##### `ingressCidrRanges`<sup>Optional</sup> <a name="ingressCidrRanges" id="alternat.AlterNatProps.property.ingressCidrRanges"></a>

```typescript
public readonly ingressCidrRanges: string[];
```

- *Type:* string[]

---

##### `ingressSecurityGroups`<sup>Optional</sup> <a name="ingressSecurityGroups" id="alternat.AlterNatProps.property.ingressSecurityGroups"></a>

```typescript
public readonly ingressSecurityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `instanceEips`<sup>Optional</sup> <a name="instanceEips" id="alternat.AlterNatProps.property.instanceEips"></a>

```typescript
public readonly instanceEips: CfnEIP[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnEIP[]

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="alternat.AlterNatProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `lifecycleHeartbeatTimeout`<sup>Optional</sup> <a name="lifecycleHeartbeatTimeout" id="alternat.AlterNatProps.property.lifecycleHeartbeatTimeout"></a>

```typescript
public readonly lifecycleHeartbeatTimeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `maxInstanceLifetime`<sup>Optional</sup> <a name="maxInstanceLifetime" id="alternat.AlterNatProps.property.maxInstanceLifetime"></a>

```typescript
public readonly maxInstanceLifetime: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

##### `natGateways`<sup>Optional</sup> <a name="natGateways" id="alternat.AlterNatProps.property.natGateways"></a>

```typescript
public readonly natGateways: CfnNatGateway[];
```

- *Type:* aws-cdk-lib.aws_ec2.CfnNatGateway[]

---

##### `privateSubnetsSelection`<sup>Optional</sup> <a name="privateSubnetsSelection" id="alternat.AlterNatProps.property.privateSubnetsSelection"></a>

```typescript
public readonly privateSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

---

##### `publicSubnetsSelection`<sup>Optional</sup> <a name="publicSubnetsSelection" id="alternat.AlterNatProps.property.publicSubnetsSelection"></a>

```typescript
public readonly publicSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="alternat.AlterNatProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `snsTopic`<sup>Optional</sup> <a name="snsTopic" id="alternat.AlterNatProps.property.snsTopic"></a>

```typescript
public readonly snsTopic: Topic;
```

- *Type:* aws-cdk-lib.aws_sns.Topic

---



