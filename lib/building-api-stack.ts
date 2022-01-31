import { Stack, StackProps, Construct } from '@aws-cdk/core'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb'

export class BuildingApiStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const buildingTable = new Table(this, 'BuildingTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING }
    })

    const api = new RestApi(this, 'Api')

    // CREATE BUILDING
    // 1. Define a lambda function.
    const createBuildingLambda = new NodejsFunction(this, 'CreateBuildingHandler', {
      entry: 'lambda/create-building.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    // 2. Grant the lambda access to our DynamoDb Table
    buildingTable.grantReadWriteData(createBuildingLambda)
    // 3. Make ApiGateway call through to our lambda for a given resource and method
    const createBuildingIntegration = new LambdaIntegration(createBuildingLambda)
    api.root.resourceForPath('/building').addMethod('POST', createBuildingIntegration)

    // DELETE BUILDING
    const deleteBuildingLambda = new NodejsFunction(this, 'DeleteBuildingHandler', {
      entry: 'lambda/delete-building.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(deleteBuildingLambda)
    const deleteBuildingIntegration = new LambdaIntegration(deleteBuildingLambda)
    api.root.resourceForPath('/building/{buildingId}').addMethod('DELETE', deleteBuildingIntegration)

    // GET BUILDING
    const getBuildingLambda = new NodejsFunction(this, 'GetBuildingHandler', {
      entry: 'lambda/get-building.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(getBuildingLambda)
    const getBuildingIntegration = new LambdaIntegration(getBuildingLambda)
    api.root.resourceForPath('/building/{buildingId}').addMethod('GET', getBuildingIntegration)

    // UPDATE BUILDING
    const updateBuildingLambda = new NodejsFunction(this, 'UpdateBuildingHandler', {
      entry: 'lambda/update-building.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(updateBuildingLambda)
    const updateBuildingIntegration = new LambdaIntegration(updateBuildingLambda)
    api.root.resourceForPath('/building/{buildingId}').addMethod('PATCH', updateBuildingIntegration)

    // CREATE ZONE
    const createZoneLambda = new NodejsFunction(this, 'CreateZoneHandler', {
      entry: 'lambda/create-zone.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(createZoneLambda)
    const createZoneIntegration = new LambdaIntegration(createZoneLambda)
    api.root.resourceForPath('/building/{buildingId}/zone').addMethod('POST', createZoneIntegration)

    // DELETE ZONE
    const deleteZoneLambda = new NodejsFunction(this, 'DeleteZoneHandler', {
      entry: 'lambda/delete-zone.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(deleteZoneLambda)
    const deleteZoneIntegration = new LambdaIntegration(deleteZoneLambda)
    api.root.resourceForPath('/building/{buildingId}/zone/{zoneId}').addMethod('DELETE', deleteZoneIntegration)

    // GET ZONE
    const getZoneLambda = new NodejsFunction(this, 'GetZoneHandler', {
      entry: 'lambda/get-zone.ts',
      environment: { BUILDING_TABLE_NAME: buildingTable.tableName }
    })
    buildingTable.grantReadWriteData(getZoneLambda)
    const getZoneIntegration = new LambdaIntegration(getZoneLambda)
    api.root.resourceForPath('/building/{buildingId}/zone/{zoneId}').addMethod('GET', getZoneIntegration)
  }
}
