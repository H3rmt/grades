import {Context} from "@actions/github/lib/context"
import {Core, Github} from "./type"
// noinspection JSUnusedGlobalSymbols
export default async ({github, context, core}: {
	github: Github, context: Context, core: Core
}) => {
	const owner = context.repo.owner
	const repo = context.repo.repo

	const {data} = await github.rest.repos.listReleases({
		owner: owner,
		repo: repo,
	})

	const release = data.sort((f, r) =>
			new Date(f.created_at).getUTCMilliseconds() -
			new Date(r.created_at).getUTCMilliseconds()
	)[0]

	const tag = release.tag_name.replace(`${repo}-v`, '')

	core.notice(`latest release-tag: ${tag}`)

	return tag
}