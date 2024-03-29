import {Core, Github} from "./type"
import {Context} from "@actions/github/lib/context"
// noinspection JSUnusedGlobalSymbols
export default async ({github, context, core, release_id, commit_head_message, version}: {
	github: Github, context: Context, core: Core,
	release_id: number, commit_head_message: string, version: string
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const {data} = await github.rest.repos.getLatestRelease({
		owner: owner,
		repo: repo,
	})

	await github.rest.repos.updateRelease({
		owner: owner,
		repo: repo,
		release_id: release_id,
		body: `### Changes:\n${commit_head_message}\n\n**Changelog**: https://github.com/${owner}/${repo}/compare/${data.tag_name}...${repo}-v${version}`,
		draft: false,
		prerelease: false,
		make_latest: false
	})

	core.info(`published release: ${repo} v${version}`)
}