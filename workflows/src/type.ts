import {GitHub} from "@actions/github/lib/utils";
import {RestEndpointMethods} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types";
import * as C from "@actions/core";

export type Github = InstanceType<typeof GitHub> & {
	rest: RestEndpointMethods;
}

export type Core = typeof C