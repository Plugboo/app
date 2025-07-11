import { Github } from '@main/utils/github'
import { LoaderVersion } from '@common/types/loader'
import { Loader, LoaderVersionCache } from '@main/loaders/loader'
import path from 'node:path'
import { application } from '@main/app'
import fs from 'node:fs'

export default class ThreeDMigoto extends Loader {
    private readonly githubUser: string

    private readonly githubRepo: string

    private readonly cacheFilePath: string

    constructor(githubUser: string, githubRepo: string, cacheFilePath: string) {
        super('3dmigoto', '3DMigoto')
        this.githubUser = githubUser
        this.githubRepo = githubRepo
        this.cacheFilePath = cacheFilePath
    }

    public async fetchVersions() {
        const absoluteCacheLocation = path.resolve(application.dataPath, this.cacheFilePath)

        /*
         * Load a cache file when found, otherwise fetch from github.
         */
        if (fs.existsSync(absoluteCacheLocation)) {
            try {
                const content = fs.readFileSync(absoluteCacheLocation, {
                    encoding: 'utf8'
                })
                const json = JSON.parse(content)

                if (typeof json.timestamp !== "number") {
                    throw new Error("Invalid timestamp")
                }

                if (!Array.isArray(json.versions)) {
                    throw new Error("Invalid versions")
                }

                /*
                 * Cache should only be valid for 2 minutes.
                 */
                if ((Date.now()) - json.timestamp > 1000 * 60 * 2) {
                    throw new Error("Cache is too old")
                }

                this.versions = []
                for (const version of json.versions) {
                    if (typeof version.version !== 'string') {
                        continue
                    }

                    if (typeof version.playFile !== 'object') {
                        continue
                    }

                    const playFile = version.playFile
                    if (typeof playFile.url !== 'string' || typeof playFile.name !== 'string') {
                        continue
                    }

                    this.versions.push({
                        version: version.version,
                        devFile: {
                            name: playFile.name,
                            url: playFile.url
                        },
                        playFile: {
                            name: playFile.name,
                            url: playFile.url
                        }
                    })
                }

                console.log('[3DMigoto (Loader)] Loaded version cache from file:', this.cacheFilePath)
                return
            } catch (exception) {
                console.error('[3DMigoto (Loader)] Exception occurred while loading version cache:', exception)
            }
        }

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
                    }
                })
            }

            {
                const cacheFolder = path.resolve(absoluteCacheLocation, "..")
                if (!fs.existsSync(cacheFolder)) {
                    fs.mkdirSync(cacheFolder, { recursive: true })
                }

                const cache: LoaderVersionCache = {
                    timestamp: Date.now(),
                    versions: versions
                }

                fs.writeFileSync(absoluteCacheLocation, JSON.stringify(cache, null, 2), {
                    encoding: "utf8"
                })
            }

            console.log('[3DMigoto (Loader)] Received', versions.length, 'versions from GitHub:\n', versions)
        } catch (exception) {
            console.error('[3DMigoto (Loader)] Exception occurred while fetching versions:', exception)
        }

        this.versions = versions
    }
}