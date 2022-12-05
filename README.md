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
