import { Github } from '@main/utils/github'
import { LoaderVersion } from '@common/types/loader'
import { Loader, LoaderVersionCache } from '@main/loaders/loader'
import path from 'node:path'
import { application } from '@main/app'
import fs from 'node:fs'
import { Profile } from '@main/profiles/profile'
import { downloadFile } from '@main/utils/net'
import AdmZip from 'adm-zip'
import * as upath from 'upath'
import GameManager from '@main/games/manager'
import { loadIni, stringifyIni } from 'load-ini'
import { Game } from '@main/games/game'
import * as child_process from 'node:child_process'

interface ThreeDMigotoConfig {
    Loader?: {
        target?: string
        launch?: string
    }
}

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

                if (typeof json.timestamp !== 'number') {
                    throw new Error('Invalid timestamp')
                }

                if (!Array.isArray(json.versions)) {
                    throw new Error('Invalid versions')
                }

                /*
                 * Cache should only be valid for 2 minutes.
                 */
                if (Date.now() - json.timestamp > 1000 * 60 * 2) {
                    throw new Error('Cache is too old')
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

            for (const release of json as Github.Release[]) {
                let devAsset: Github.Asset | null = null
                let playAsset: Github.Asset | null = null

                for (const asset of release.assets) {
                    if (
                        asset.content_type !== 'application/x-zip-compressed' &&
                        asset.content_type !== 'application/zip'
                    ) {
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
                const cacheFolder = path.resolve(absoluteCacheLocation, '..')
                if (!fs.existsSync(cacheFolder)) {
                    fs.mkdirSync(cacheFolder, { recursive: true })
                }

                const cache: LoaderVersionCache = {
                    timestamp: Date.now(),
                    versions: versions
                }

                fs.writeFileSync(absoluteCacheLocation, JSON.stringify(cache, null, 2), {
                    encoding: 'utf8'
                })
            }

            console.log('[3DMigoto (Loader)] Received', versions.length, 'versions from GitHub:\n', versions)
        } catch (exception) {
            console.error('[3DMigoto (Loader)] Exception occurred while fetching versions:', exception)
        }

        this.versions = versions
    }

    public async installVersion(profile: Profile, version: string): Promise<boolean> {
        const game = GameManager.entries.find((v) => v.info.id === profile.gameId)
        if (game === undefined) {
            console.error('[3DMigoto (Loader)] Game not found:', profile.gameId)
            return false
        }

        if (game.installPath === null) {
            console.error('[3DMigoto (Loader)] Game does not have an install path:', profile.gameId)
            return false
        }

        const versionObj = this.versions.find((v) => v.version === version)
        if (versionObj === undefined) {
            console.error('[3DMigoto (Loader)] Version not found:', version)
            return false
        }

        const versionPath = path.resolve(application.dataPath, 'loaders', profile.gameId, versionObj.playFile.name)

        if (!fs.existsSync(versionPath)) {
            console.log('[3DMigoto (Loader)] Downloading version:', versionObj.playFile.name)

            if (!(await downloadFile(versionObj.playFile.url, versionPath))) {
                console.error('[3DMigoto (Loader)] Failed to download version:', version)
                return false
            }

            console.log('[3DMigoto (Loader)] Downloaded version:', versionObj.playFile.name)
        }

        const archive = new AdmZip(versionPath)

        /*
         * Manually extract every file, with a few exceptions, to the profile folder.
         * Without exceptions we would use extractEntryTo.
         */
        for (const entry of archive.getEntries()) {
            const realPath = entry.entryName.startsWith('3dmigoto')
                ? upath.normalize(entry.entryName).replace('3dmigoto/', '')
                : entry.entryName
            const absolutePath = path.resolve(profile.path, realPath)

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
            }
        }

        await this.setupConfig(profile, game)
        return true
    }

    public async startVersion(profile: Profile, _version: string): Promise<void> {
        const loaderPath = path.resolve(profile.path, '3DMigoto Loader.exe')

        if (!fs.existsSync(loaderPath)) {
            console.error('[3DMigoto (Loader)] Loader Executable not found:', loaderPath)
            return
        }

        const process = child_process.spawn(
            'powershell.exe',
            [
                '-ExecutionPolicy',
                'ByPass',
                '-Command',
                `& {Start-Process "${loaderPath}" -Verb RunAs -WorkingDirectory "${profile.path}"}`
            ],
            {
                stdio: ['ignore', 'pipe', 'pipe']
            }
        )

        process.stdout.setEncoding('utf8')
        process.stderr.setEncoding('utf8')

        process.stdout.on('data', (chunk) => {
            console.log('[3DMigoto (Loader)] - Loader Process - STDOUT: ' + chunk)
        })

        process.stderr.on('data', (chunk) => {
            console.log('[3DMigoto (Loader)] - Loader Process - STDERR: ' + chunk)
        })

        process.on('exit', (code) => {
            console.log('[3DMigoto (Loader)] - Loader Process - EXITED: ' + code)
        })

        process.unref()
    }

    private async setupConfig(profile: Profile, game: Game) {
        try {
            const rawConfig = await loadIni(path.resolve(profile.path, 'd3dx.ini'))
            if (Array.isArray(rawConfig)) {
                console.log("[3DMigoto (Loader)] Couldn't load d3dx.ini.")
                return false
            }

            const config = JSON.parse(JSON.stringify(rawConfig)) as ThreeDMigotoConfig
            if (config.Loader === undefined || config.Loader.target === undefined) {
                console.log('[3DMigoto (Loader)] Invalid d3dx.ini file.')
                return false
            }

            config.Loader.launch = path.resolve(game.installPath, config.Loader.target)
            fs.writeFileSync(path.resolve(profile.path, 'd3dx.ini'), stringifyIni(config))

            return true
        } catch {
            console.log('[3DMigoto (Loader)] Unknown error setup config.')
            return false
        }
    }
}
