import { Github } from '@main/utils/github'
import { LoaderVersion } from '@common/loader'
import { Loader } from '@main/loaders/loader'

export default class ThreeDMigoto extends Loader {
    private readonly githubUser: string

    private readonly githubRepo: string

    constructor(githubUser: string, githubRepo: string) {
        super('3dmigoto', '3DMigoto')
        this.githubUser = githubUser
        this.githubRepo = githubRepo
    }

    public async fetchVersions() {
        const versions: LoaderVersion[] = []
        console.log(`[3DMigoto (Loader)] Fetching versions from GitHub (${this.githubUser}/${this.githubRepo})...`)

        try {
            const url = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/releases`
            const response = await fetch(url)
            const json = await response.json()

            for (const release of (json as Github.Release[])) {
                let devAsset: Github.Asset | null = null
                let playAsset: Github.Asset | null = null

                for (const asset of release.assets) {
                    if (asset.content_type !== 'application/x-zip-compressed' && asset.content_type !== 'application/zip') {
                        continue
                    }

                    if (asset.name.toLowerCase().includes('dev')) {
                        devAsset = asset
                    } else if (asset.name.toLowerCase().includes('play')) {
                        playAsset = asset
                    }
                }

                if (devAsset === null || playAsset === null) {
                    continue
                }

                versions.push({
                    version: release.tag_name,
                    devFile: {
                        name: devAsset.name,
                        url: devAsset.browser_download_url
                    },
                    playFile: {
                        name: playAsset.name,
                        url: playAsset.browser_download_url
                    },
                })
            }

            console.log('[3DMigoto (Loader)] Received', versions.length, 'versions from GitHub:\n', versions)
        } catch (exception) {
            console.error('[3DMigoto (Loader)] Exception occurred while fetching versions:', exception)
        }

        this.versions = versions
    }
}