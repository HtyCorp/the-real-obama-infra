import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";

export class BatchSupportStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Bucket(this, 'TranscribeInputBucket', {
            bucketName: 'htycorp-therealobama-audio-transcribe-input'
        });

        new Bucket(this, 'TranscribeOutputBucket', {
            bucketName: 'htycorp-therealobama-audio-transcribe-output'
        });
    }
}