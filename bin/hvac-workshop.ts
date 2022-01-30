#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { BuildingApiStack } from '../lib/building-api-stack'

const app = new cdk.App()
new BuildingApiStack(app, 'HvacWorkshopStack')
