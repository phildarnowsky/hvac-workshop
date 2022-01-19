#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HvacWorkshopStack } from '../lib/hvac-workshop-stack';

const app = new cdk.App();
new HvacWorkshopStack(app, 'HvacWorkshopStack');
