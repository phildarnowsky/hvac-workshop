#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { BuildingApiStack } from '../lib/building-api-stack'

const app = new cdk.App()

// eslint-disable-next-line no-new
new BuildingApiStack(app, 'HvacWorkshopStack')
