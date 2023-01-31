import {Core, Github} from "./type"
import {Context} from "@actions/github/lib/context"
// noinspection JSUnusedGlobalSymbols
export default async ({github, context, core, gistId, fileName}: {
	github: Github, context: Context, core: Core,
	gistId: string, fileName: string,
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
		release_id: data.id,
		draft: false,
		prerelease: false,
		make_latest: true
	})

	core.info(`set release: ${data.tag_name} as latest`)

	const update = data.assets.find(asset => asset.name === 'update.json')
	if (update === undefined) {
		core.error('update.json not found')
		return
	}

	const asset = await github.rest.repos.getReleaseAsset({
		owner: owner,
		repo: repo,
		asset_id: update.id
	})

	const asset_data = await github.request(asset.data.browser_download_url, {
		headers: {
			'Accept': 'application/octet-stream'
		}
	})

	core.info(`updating ${fileName} in gist with id: ${gistId} for tauri updater`)
	await github.rest.gists.update({
		gist_id: gistId,
		files: {[fileName]: {content: asset_data.data}}
	})
}
