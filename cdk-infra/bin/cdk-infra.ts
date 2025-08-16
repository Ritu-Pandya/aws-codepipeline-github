#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkInfraStack } from '../lib/cdk-infra-stack';

const app = new cdk.App();
new CdkInfraStack(app, 'CdkInfraStack', {
  // GitHub configuration
  githubOwner: 'Ritu-Pandya', // Replace with your GitHub username
  githubRepo: 'Aws-codepipeline-github', // Replace with your GitHub repository name
  githubBranch: 'main', // Replace with your branch name (usually 'main' or 'master')
  githubTokenSecretName: 'mygithub-token-new', // Name of the secret in AWS Secrets Manager containing your GitHub token
  // Environment configuration
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  },
});