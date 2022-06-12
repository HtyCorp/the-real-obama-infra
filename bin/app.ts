#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PipelineStack} from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, 'PipelineStack', {
    env: {
        account: '770847600512',
        region: 'ap-southeast-2'
    }
});
