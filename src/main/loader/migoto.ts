import { Loader } from './index'
import { GitHub } from '@main/util/github'

export class MigotoLoader extends Loader {
    private readonly githubUser: string

    private readonly githubRepo: string

    constructor(githubUser: string, githubRepo: string) {
        super('migoto', '3DMigoto')
        this.githubUser = githubUser
        this.githubRepo = githubRepo
    }

    public async fetchVersions() {
        this.versions = []

        try {
            const releases = await GitHub.getReleases(this.githubUser, this.githubRepo)
            for (const release of releases) {
                for (const asset of release.assets) {
                    if (
                        asset.content_type !== 'application/x-zip-compressed' &&
                        asset.content_type !== 'application/zip'
                    ) {
                        continue
                    }

                    if (!asset.name.toLowerCase().includes('play')) {
                        continue
                    }

                    this.versions.push({
                        version: release.tag_name,
                        file: {
                            name: asset.name,
                            url: asset.browser_download_url
                        }
                    })
                }
            }
        } catch (exception) {
            console.error(`[MigotoLoader] Failed to fetch versions (${this.githubUser}/${this.githubRepo}):`, exception)
        }
    }
}
