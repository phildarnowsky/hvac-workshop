# Welcome to the HVAC Workshop!
This project is a barebones AWS Serverless environment with lots of opportunities for improvement. It defines a simple service that's used to set up buildings. It currently consists of a pair of parent/child entities:
1. `Buildings`:  have an id, name, and setpoints
2. `Rooms`: also have an id, name, and setpoints.

## Getting Started
### Prerequisites:
* We should have provided you with an AWS account
* Install the aws-cli
* Clone this project
* Check out the [AWS CDK framework](https://docs.aws.amazon.com/cdk/v2/guide/home.html)

### Setup
1. Run `aws configure` and use the provided `access key` and `secret access key` (other values can stay default)
2. From the project, run `cdk bootstrap` to get initial resources for subsequent CDK deployments.
3. Run `npm run cdk diff` to view the changset that CDK is ready to deploy. After taking a look, actually deploy the project with `cdk deploy`.
4. Find the "Outputs" section in the deploy logs. Find the api url (e.g. https://some-unique-id.execute-api.us-east-1.amazonaws.com/prod/). This will be our api url for the rest of the project. If you lose it, go to the AWS ApiGateway console and find it in "Api > Dashboard".
5. Go to the `test/integration.test.ts` file and replace `buildingApiUrl` with your api url from step #4. Run the tests with `npm run test`.

## Explore
### See your deployed infrastructure.
Sign into the AWS console and check out the parts of your deployed serverless application
* **CloudFormation**: View the stack "HvacWorkshopStack" deployed on your behalf by CDK
* **DynamoDB**: View and modify the DynamoDB table set up for our service. There will be no items to begin with, but you can use the existing API to seed some data (see "Call the Api" below).
* **Lambda**: View compiled typescript code, trigger endpoints manually, and modify lambda code. Use the "Monitor" tab and click "View logs in CloudWatch" to see logs from previous runs.
    * **Modifying code**: While you can safely modify the lambda code in-place, those changes will be overwritten on the next deployment.
    * **External libraries**: The current packaging system places all our external library source code at the top of the lambda code assets. Go to the bottom to view handler code.

### Example requests
The integration tests demonstrate usage of the api. While adding new features, you can manually seed data or extend the integration tests as you go. Below is an example curl request.
```sh
# Create Building
curl --request POST \
  --url https://your-unique-id.execute-api.us-east-1.amazonaws.com/prod/building \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "300 W Hollywood",
	"setpoints": [70,74]
}'
```

# Tasks
Time to get your hands dirty! Use the existing code, online resources, and the AWS console to add the following features to the project. Everything can be done by writting CDK code and running `npm run cdk deploy`. 

If you run into any issues or need clarification, feel free to reach out.

1. Add the endpoint: "GET /building/{buildlingId}", which retrieves an existing building by id.
2. Add the endpoint: "UPDATE /building/{buildingId}", which updates the name and setpoints for a building.
3. Add the endpoint: "GET /building/zone/{zoneId}/setpoints". Return either the building setpoints if the zone does not define setpoints (the field is optional) or the zone setpoints if they are specified. Notice that the path is no longer prepended with the buildingId [Hint: check out DynamoDB secondary indexes].

## Helpful Resources
* [DynamoDB Overview](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html): Goes over the core components of AWS DynamoDB
* [DynamoDB DocumentClient Cheatsheet](https://dynobase.dev/dynamodb-nodejs/#delete-item): Example usages of DynamoDB for lambda code
* [CDK Workshop](https://cdkworkshop.com/20-typescript/30-hello-cdk/400-apigw.html): Not necessary for this exercise, but a complimentary tutorial.

## Notes
* Do not alter CDK managed resources from the console. If you do, there's a good chance they'll get out of sync and the resolution is a tedious manual process or recreating the entire stack (resource group).
* If you ever get in a bad state, run `npm run cdk destroy` to delete all your stacks

## Useful commands
 * `npm run test`            perform the jest unit tests
 * `npm run cdk deploy`      deploy this stack to your default AWS account/region
 * `npm run cdk diff`        compare deployed stack with current state
 * `npm run cdk destroy`     destroys the specified stack(s)
