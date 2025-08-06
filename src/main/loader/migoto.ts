import { Loader } from './index'
import { GitHub } from '@main/util/github'
import { Profile } from '@main/game/profile'
import path from 'node:path'
import { downloadFile } from '@main/util/internet'
import AdmZip from 'adm-zip'
import upath from 'upath'
import fs from 'node:fs'
import { v4 } from 'uuid'

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

    public async installVersion(profile: Profile) {
        if (profile.loader === null) {
            throw new Error('Profile does not have a loader assigned.')
        }

        const version = this.versions.find((v) => v.version === profile.loader.version.version)
        if (version === undefined) {
            throw new Error(`Profile does not have a valid loader version (${profile.loader.version.version}).`)
        }

        const downloadPath = path.resolve(profile.getFolderPath(), `${v4()}.zip`)
        const downloadResult = await downloadFile(version.file.url, downloadPath, (progress) => {
            console.log(`[MigotoLoader] Downloading loader version (${version.version}): ${progress}%`)
        })

        if (!downloadResult) {
            throw new Error(`Failed to download loader version (${version.version}).`)
        }

        console.log('[MigotoLoader] Finished loader download.')

        console.log('[MigotoLoader] Begin extraction..')
        const archive = new AdmZip(downloadPath)

        /*
         * Manually extract every file, with a few exceptions, to the profile folder.
         * Without exceptions we would use extractEntryTo.
         */
        for (const entry of archive.getEntries()) {
            const realPath = entry.entryName.startsWith('3dmigoto')
                ? upath.normalize(entry.entryName).replace('3dmigoto/', '')
                : entry.entryName
            const absolutePath = path.resolve(profile.getFolderPath(), realPath)

            /*
             * We don't need that here.
             */
            if (realPath === 'README.txt') {
                continue
            }

            if (entry.isDirectory) {
                if (!fs.existsSync(absolutePath)) {
                    fs.mkdirSync(absolutePath, { recursive: true })
                }
            } else {
                /*
                 * Don't override the current configuration.
                 */
                if (realPath === 'd3dx.ini' && fs.existsSync(absolutePath)) {
                    continue
                }

                fs.writeFileSync(absolutePath, entry.getData())
                console.log(`[MigotoLoader] Extracted file: ${realPath}`)
            }
        }

        console.log('[MigotoLoader] Extraction finished.')

        /*
         * Remove the downloaded zip file after extraction.
         */
        fs.rmSync(downloadPath)
    }
}
