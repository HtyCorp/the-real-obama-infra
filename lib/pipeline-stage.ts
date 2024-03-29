import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {InfraStack} from "./infra-stack";
import {SimpleSiteStack} from "./simple-site-stack";

export class PipelineStage extends Stage {

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        new InfraStack(this, 'InfraStack');
        new SimpleSiteStack(this, 'SimpleSiteStack');
    }
}
