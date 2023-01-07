import {Context} from "@actions/github/lib/context";
import {Core, Github} from "./type";

export default async ({github, context, core, version, commit_head_message}: {
	github: Github, context: Context, core: Core, version: string, commit_head_message: string
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const {data} = await github.rest.repos.createRelease({
		owner: owner,
		repo: repo,
		tag_name: `${repo}-v${version}`,
		name: `${repo} v${version}`,
		body: `**_--Draft--_**\n\n### Changes:\n${commit_head_message}\n\nAssets getting generated...`,
		draft: true,
		prerelease: false
	})

	core.notice(`created release: ${repo} v${version}`)

	return data.id
}