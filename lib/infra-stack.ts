import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import {Cluster, ContainerImage, FargateService, FargateTaskDefinition} from "aws-cdk-lib/aws-ecs";
import {DockerImageAsset} from "aws-cdk-lib/aws-ecr-assets";
import {SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const botTokenSecret = new Secret(this, 'BotTokenSecret', {
      secretName: 'DiscordBotToken'
    });

    const serviceDockerImage = new DockerImageAsset(this,'ServiceImage', {
      directory: 'docker/service'
    });
    const serviceTaskDefinition = new FargateTaskDefinition(this, 'ServiceTask', {
      cpu: 512,
      memoryLimitMiB: 4096
    });
    serviceTaskDefinition.addContainer('Service', {
      image: ContainerImage.fromDockerImageAsset(serviceDockerImage)
    });

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
    const fargateService = new FargateService(this, 'Service', {
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
  }
}
