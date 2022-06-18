import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import {Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDriver} from "aws-cdk-lib/aws-ecs";
import {DockerImageAsset} from "aws-cdk-lib/aws-ecr-assets";
import {SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const botTokenSecret = new Secret(this, 'BotTokenSecret', {
      secretName: 'DiscordBotToken'
    });

    const serviceLogs = new LogGroup(this, 'ServiceLogs', {
      logGroupName: 'TheRealObama/app',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.SIX_MONTHS
    });

    const serviceDockerImage = new DockerImageAsset(this,'ServiceImage', {
      directory: 'docker/service'
    });
    const serviceTaskDefinition = new FargateTaskDefinition(this, 'ServiceTask', {
      cpu: 512,
      memoryLimitMiB: 4096
    });
    serviceTaskDefinition.addContainer('Service', {
      image: ContainerImage.fromDockerImageAsset(serviceDockerImage),
      logging: LogDriver.awsLogs({
        logGroup: serviceLogs,
        streamPrefix: 'TheRealObama'
      })
    });

    botTokenSecret.grantRead(serviceTaskDefinition.taskRole);

    const serviceVpc = new Vpc(this, 'ServiceVpc', {
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 20
        }
      ]
    });
    const fargateCluster = new Cluster(this, 'Cluster', {
      vpc: serviceVpc,
      enableFargateCapacityProviders: true
    });
    new FargateService(this, 'Service', {
      cluster: fargateCluster,
      assignPublicIp: true,
      circuitBreaker: {
        rollback: true
      },
      taskDefinition: serviceTaskDefinition,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1
        }
      ]
    });

    const wordAudioBucket = new Bucket(this, 'WordAudioBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      bucketName: 'htycorp-therealobama-word-audio'
    });
    wordAudioBucket.grantRead(serviceTaskDefinition.taskRole);

    const wordMetadataTable = new Table(this, 'WordMetadataTable', {
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: 'WordMetadata',
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'word',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'variant',
        type: AttributeType.STRING
      }
    });
    wordMetadataTable.grantReadData(serviceTaskDefinition.taskRole);
  }
}
