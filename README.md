# Welcome to the HVAC Workshop!
This project is a barebones AWS Serverless environment with lots of opportunities for improvement. It defines a simple service that's used to set up buildings. It currently consists of a pair of parent/child entities:
1. `Buildings`:  have an id, name, and setpoints
2. `Rooms`: also have an id, name, and setpoints.

Take some time to get aquainted with the AWS CDK framework, then dig in to the "Tasks".

## Getting Started
### Prerequisites:
* We should have provided you with an AWS account
* Install the aws-cli
* Clone this project
* Check out: [What is the AWS CDK?](https://docs.aws.amazon.com/cdk/v2/guide/home.html)

### Setup
1. Run `aws configure` and use the provided `access key` and `secret access key` (other values can stay default)
2. From the project, run `cdk bootstrap` to get initial resources for subsequent CDK deployments.
3. Run `cdk diff` to view the changset that CDK is ready to deploy. After taking a look, actually deploy the project with `cdk deploy`.
4. Find the "Outputs" section in the deploy logs. Find the api url (e.g. https://mxo9q8mll4.execute-api.us-east-1.amazonaws.com/prod/). This will be our api url for the rest of the project. If you lose it, go to the AWS ApiGateway console and find it in "Api > Dashboard".

## Tasks
Time to get your hands dirty! Use the existing code, online resources, and the AWS console to add the following features to the project. Everything can be done by writting CDK code and running `cdk deploy`. If you run into any issues or need clarification, feel free to reach out.

### Easy
1. Add the endpoint: "GET /building/{buildlingId}"
### Medium
2. Add the endpoint: "UPDATE /building/{buildingId}"
3. Add the endpoint: "UPDATE /building/{buildingId}/zone/{zoneId}"
### Hard
4. Use EventBridge to schedule a Lambda that runs every 5 min and print the number of buildings/zones.
5. Remove the need for a prepended `building` resource from all the zone endpoints. For example, instead of `/building/{buildingId}/zone/{zoneId}` we should have `zone/{zoneId}`. [Hint: check out DynamoDB secondary indexes]

## Helpful Resources
* [DynamoDB DocumentClient Cheatsheet](https://dynobase.dev/dynamodb-nodejs/#delete-item): Examples of how to access DynamoDB in lambdas using DynamoDB.DocumentClient().
* [DynamoDB Overview](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html): Goes over the core components of AWS DynamoDB
* [CDK Workshop](https://cdkworkshop.com/20-typescript/30-hello-cdk/400-apigw.html): Not necessary for this exercise, but a complimentary tutorial.

## Notes
* Do not alter CDK managed resources from the console. If you do, there's a good chance they'll get out of sync and the resolution is a tedious manual process or recreating the entire stack (resource group).
* If you ever get in a bad state, run `cdk destroy` to delete all your stacks

## Useful commands
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk destroy`     destroys the specified stack(s)
