import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "aws-cdk-lib/pipelines";
import {PipelineStage} from "./pipeline-stage";
import {ComputeType, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";

const githubConnectionArn = 'arn:aws:codestar-connections:ap-southeast-2:770847600512:connection/978e0be3-2c47-4d77-84a9-2593fb20e6b0'

export class PipelineStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'TheRealObama',
            synth: new CodeBuildStep('BuildProject', {
                input: githubRepo('the-real-obama-infra'),
                additionalInputs: {
                    '../the-real-obama': githubRepo('the-real-obama')
                },
                installCommands: [
                    '(cd ../the-real-obama && ./install.sh)',
                    './install.sh',
                ],
                commands: [
                    '(cd ../the-real-obama && ./build.sh)',
                    './build.sh'
                ],
                buildEnvironment: {
                    buildImage: LinuxBuildImage.STANDARD_5_0,
                    computeType: ComputeType.LARGE
                }
            })
        });

        pipeline.addStage(new PipelineStage(this, 'Beta'));
    }
}

function githubRepo(repoName: string) {
    return CodePipelineSource.connection('HtyCorp/' + repoName, "master", {
        connectionArn: githubConnectionArn
    });
}
