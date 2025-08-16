# Deploy the CDK stack
# This script helps deploy the CDK infrastructure to AWS

# Change to the CDK directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
cd "$scriptDir\..\cdk-infra"

# Ensure dependencies are installed
npm install

# Build the TypeScript code
npm run build

# Deploy the CDK stack
npx cdk deploy

Write-Host "CDK deployment completed!" -ForegroundColor Green
