import {Core, Github} from "./type";
import {Context} from "@actions/github/lib/context";

export default async ({github, context, core, release_id, commit_head_message, version}: {
	github: Github, context: Context, core: Core, release_id: number, commit_head_message: string, version: string
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const {data} = await github.request('GET /repos/{owner}/{repo}/releases/latest', {
		owner: owner,
		repo: repo,
	})

	await github.rest.repos.updateRelease({
		owner: owner,
		repo: repo,
		release_id: release_id,
		body: `### Changes:\n${commit_head_message}\n\n**Changelog**: https://github.com/${owner}/${repo}/compare/${data.tag_name}...${repo}-v${version}`,
		draft: false,
		prerelease: false
	})

	core.notice(`published release: ${repo} v${version}`)

	return `${context.repo.repo}-v${version}`
}


// ${{ needs.create-release.outputs.release-id }}, ${{ github.event.head_commit.message }}, {{ needs.create-release.outputs.version }}