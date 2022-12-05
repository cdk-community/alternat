# alterNAT, CDK Edition

NAT Gateways are dead. Long live NAT instances!

This is an AWS CDK implementation of [alterNAT](https://alternat.cloud). The original project is implemented in Terraform. We rely on the original project's `replace-route` Lambda function and its EC2 User Data boot script. See the sections below to learn how these fit together.
