import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "aws-cdk-lib/pipelines";
import {PipelineStage} from "./pipeline-stage";

const githubConnectionArn = 'arn:aws:codestar-connections:ap-southeast-2:770847600512:connection/978e0be3-2c47-4d77-84a9-2593fb20e6b0'

export class PipelineStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'TheRealObama',
            synth: new CodeBuildStep('BuildProject', {
                input: githubRepo('the-real-obama-infra'),
                additionalInputs: {
                    '../service': githubRepo('the-real-obama')
                },
                installCommands: [
                    '../service/install.sh',
                    './install.sh',
                ],
                commands: [
                    '../service/build.sh',
                    './build.sh'
                ]
            })
        });

        const beta = pipeline.addStage(new PipelineStage(this, 'Beta'));
    }
}

function githubRepo(repoName: string) {
    return CodePipelineSource.connection('HtyCorp/' + repoName, "master", {
        connectionArn: githubConnectionArn
    });
}