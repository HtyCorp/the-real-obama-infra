import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {InfraStack} from "./infra-stack";
import {BatchSupportStack} from "./batch-support-stack";

export class PipelineStage extends Stage {

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new InfraStack(this, 'InfraStack');
        new BatchSupportStack(this, 'BatchSupportStack');
    }
}
