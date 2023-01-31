import {Context} from "@actions/github/lib/context"
import {Core, Github} from "./type"
// noinspection JSUnusedGlobalSymbols
export default async ({github, context, core}: {
	github: Github, context: Context, core: Core
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const {data} = await github.rest.repos.getLatestRelease({
		owner: owner,
		repo: repo,
	})

	const tag = data.tag_name.replace(`${repo}-v`, '')

	core.notice(`latest release-tag: ${tag}`)

	return tag
}