# Deploy the CDK stack
# This script helps deploy the CDK infrastructure to AWS

# Change to the CDK directory
cd "$(dirname "$0")/../cdk-infra"

# Ensure dependencies are installed
npm install

# Build the TypeScript code
npm run build

# Deploy the CDK stack
npx cdk deploy

echo "CDK deployment completed!"
