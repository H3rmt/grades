import {Context} from "@actions/github/lib/context";
import {Core, Github} from "./type";

export default async ({github, context, core}: {
	github: Github, context: Context, core: Core
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const data = await github.request('GET /repos/{owner}/{repo}/releases/latest', {
		owner: owner,
		repo: repo,
	})

	const tag = data.data.tag_name.replace(`${repo}-v`, '')

	core.notice(`latest release-tag: ${tag}`)

	return tag
}