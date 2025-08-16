# AWS CodePipeline with GitHub and React App Deployment to S3

This project demonstrates how to deploy a React.js application to AWS S3 using AWS CDK to create an infrastructure pipeline with GitHub integration.

## Project Structure

- `react-app/`: React.js application created with Create React App
- `cdk-infra/`: AWS CDK infrastructure code for creating:
  - S3 bucket for website hosting
  - CloudFront distribution
  - CodePipeline with GitHub integration

## Prerequisites

- Node.js and npm installed
- AWS CLI installed and configured with appropriate credentials
- GitHub account and repository
- GitHub personal access token stored in AWS Secrets Manager

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate a new token with `repo` and `admin:repo_hook` scopes
3. Store this token in AWS Secrets Manager:

```bash
aws secretsmanager create-secret --name github-token --secret-string YOUR_TOKEN_HERE
```

### 2. Update GitHub Configuration

Edit `cdk-infra/bin/cdk-infra.ts` and update:
- `githubOwner`: Your GitHub username
- `githubRepo`: Your repository name
- `githubBranch`: Your branch name (usually `main`)

### 3. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Aws-codepipeline-github.git
git push -u origin main
```

### 4. Deploy the CDK Stack

```bash
cd cdk-infra
npm run build
npx cdk deploy
```

## Local Development

To run the React app locally:

```bash
cd react-app
npm start
```

## Deployment

The pipeline will automatically deploy your React app whenever you push to the GitHub repository.

## Cleanup

To delete all resources:

```bash
cd cdk-infra
npx cdk destroy
```

## Notes

- For production environments, update the S3 bucket and CloudFront settings for higher security
- Consider adding custom domain name configuration through Route 53
