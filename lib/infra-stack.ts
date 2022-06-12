import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const botTokenSecret = new Secret(this, 'BotTokenSecret', {
      secretName: 'DiscordBotToken'
    });
  }
}
