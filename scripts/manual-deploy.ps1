# Manual deployment script for React app to S3
# This script can be used to manually deploy the React app to S3 without going through the pipeline

# Change to the React app directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
cd "$scriptDir\..\react-app"

# Ensure dependencies are installed
npm install

# Build the React app
npm run build

# Get the S3 bucket name from the CDK output
# You'll need to replace this with your actual bucket name if you haven't deployed via CDK yet
$bucketName = aws cloudformation describe-stacks --stack-name CdkInfraStack --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text

if (-not $bucketName) {
    Write-Host "Error: Could not find S3 bucket name from CloudFormation output." -ForegroundColor Red
    Write-Host "Please deploy the CDK stack first or specify the bucket name manually in this script." -ForegroundColor Red
    exit 1
}

# Sync the build folder to S3
Write-Host "Deploying to S3 bucket: $bucketName" -ForegroundColor Cyan
aws s3 sync build/ "s3://$bucketName" --delete

# Get the CloudFront distribution ID
$distributionId = aws cloudformation describe-stacks --stack-name CdkInfraStack --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text

if ($distributionId) {
    # Create an invalidation to clear the CloudFront cache
    Write-Host "Creating CloudFront invalidation for distribution: $distributionId" -ForegroundColor Cyan
    aws cloudfront create-invalidation --distribution-id "$distributionId" --paths "/*"
}

Write-Host "Manual deployment completed!" -ForegroundColor Green
