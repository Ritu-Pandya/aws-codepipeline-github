import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

interface ReactAppDeploymentStackProps extends cdk.StackProps {
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
  githubTokenSecretName: string;
}

export class CdkInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ReactAppDeploymentStackProps) {
    super(scope, id, props);

    // Create an S3 bucket for website hosting
    const websiteBucket = new s3.Bucket(this, 'ReactAppBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html', // SPA routing support
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo purposes only
      autoDeleteObjects: true, // For demo purposes only
    });

  // ...existing code...

    // Pipeline for building and deploying the React app
    const pipeline = new codepipeline.Pipeline(this, 'ReactAppPipeline', {
      pipelineName: 'ReactApp-Pipeline',
    });

    // Source stage for GitHub
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub',
      owner: props.githubOwner,
      repo: props.githubRepo,
      branch: props.githubBranch,
      oauthToken: cdk.SecretValue.secretsManager(props.githubTokenSecretName),
      output: sourceOutput,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Build stage for the React app
    const buildOutput = new codepipeline.Artifact();
    const buildProject = new codebuild.PipelineProject(this, 'ReactAppBuild', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'cd react-app',
              'npm ci',
            ],
          },
          build: {
            commands: [
              'npm run build',
            ],
          },
        },
        artifacts: {
          'base-directory': 'react-app/build',
          files: ['**/*'],
        },
      }),
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'BuildReactApp',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    // Deploy stage to S3
    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'DeployToS3',
      bucket: websiteBucket,
      input: buildOutput,
      runOrder: 1,
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

  // ...existing code...

    // Output the S3 website URL
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'The URL of the S3 hosted website',
    });
    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'The name of the S3 bucket',
    });
    // Output the GitHub connection details
    new cdk.CfnOutput(this, 'GitHubConnection', {
      value: `https://github.com/${props.githubOwner}/${props.githubRepo}`,
      description: 'The GitHub repository linked to this pipeline',
    });
  }
}
