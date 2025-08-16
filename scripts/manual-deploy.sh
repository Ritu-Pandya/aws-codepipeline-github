# Manual deployment script for React app to S3
# This script can be used to manually deploy the React app to S3 without going through the pipeline

# Change to the React app directory
cd "$(dirname "$0")/../react-app"

# Ensure dependencies are installed
npm install

# Build the React app
npm run build

# Get the S3 bucket name from the CDK output
# You'll need to replace this with your actual bucket name if you haven't deployed via CDK yet
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name CdkInfraStack --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)

if [ -z "$BUCKET_NAME" ]; then
  echo "Error: Could not find S3 bucket name from CloudFormation output."
  echo "Please deploy the CDK stack first or specify the bucket name manually in this script."
  exit 1
fi

# Sync the build folder to S3
echo "Deploying to S3 bucket: $BUCKET_NAME"
aws s3 sync build/ "s3://$BUCKET_NAME" --delete

# Get the CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name CdkInfraStack --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)

if [ -n "$DISTRIBUTION_ID" ]; then
  # Create an invalidation to clear the CloudFront cache
  echo "Creating CloudFront invalidation for distribution: $DISTRIBUTION_ID"
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
fi

echo "Manual deployment completed!"
