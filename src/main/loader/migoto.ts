import { Loader } from './index'
import { GitHub } from '@main/util/github'
import { Profile, ProfileMod } from '@main/game/profile'
import path from 'node:path'
import { downloadFile } from '@main/util/internet'
import AdmZip from 'adm-zip'
import upath from 'upath'
import fs from 'node:fs'
import { v4 } from 'uuid'
import { multiExists } from '@main/util/filesystem'
import child_process from 'node:child_process'
import { dialog } from 'electron'
import { loadIni, stringifyIni } from 'load-ini'
import { GameManager } from '@main/game/manager'
import { Game } from '@main/game'
import { Mod, ModFile } from '@preload/types/service'
import mime from 'mime-types'

interface Config {
    Loader?: {
        target?: string
        launch?: string
    }
}

export class MigotoLoader extends Loader {
    private readonly githubUser: string

    private readonly githubRepo: string

    constructor(githubUser: string, githubRepo: string) {
        super('migoto', '3DMigoto')
        this.githubUser = githubUser
        this.githubRepo = githubRepo
    }

    public async startProcess(profile: Profile) {
        if (process.platform !== 'win32') {
            dialog.showMessageBoxSync({
                type: 'error',
                title: 'Start Failure',
                message: 'Plugboo can unfortunately only start this game, with this loader, on Windows.',
                buttons: ['Okay'],
                noLink: true
            })
            return
        }

        this.startWindowsProcess(profile)
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

        await this.setupConfig(profile, GameManager.getGame(profile.gameId))

        /*
         * Remove the downloaded zip file after extraction.
         */
        fs.rmSync(downloadPath)
    }

    public validateInstallation(profile: Profile): boolean {
        return multiExists(profile.getFolderPath(), ['nvapi64.dll', 'd3dx.ini', 'd3dcompiler_46.dll', 'd3d11.dll'])
    }

    public async installMod(profile: Profile, mod: Mod, file: ModFile) {
        const extension = mime.extension(file.mimetype)
        if (!extension || !['zip', 'rar'].includes(extension)) {
            throw new Error('Invalid file type.')
        }

        const folderPath = path.resolve(profile.getFolderPath(), 'mods', String(mod.id))
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)
        }

        const downloadPath = path.resolve(folderPath, v4())
        const downloadResult = await downloadFile(file.url, downloadPath, (progress) => {
            console.log(`[MigotoLoader] Downloading mod file (${mod.id}): ${progress}%`)
        })

        if (!downloadResult) {
            throw new Error(`Failed to download mod file (${mod.id}).`)
        }

        console.log('[MigotoLoader] Finished mod download.')

        const dataPath = path.resolve(folderPath, 'data')
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath)
        }

        const archive = new AdmZip(downloadPath)
        archive.extractAllTo(dataPath, true)

        const resultMod = new ProfileMod(String(mod.id), profile.id, mod.name, mod.version, mod.author.name)
        resultMod.isEnabled = true
        resultMod.writeToDisk()
        console.log(`[MigotoLoader] Installed mod (${mod.id})`)

        fs.rmSync(downloadPath)
    }

    private startWindowsProcess(profile: Profile) {
        const loaderPath = path.resolve(profile.getFolderPath(), '3DMigoto Loader.exe')

        if (!fs.existsSync(loaderPath)) {
            console.error('[MigotoLoader] Loader Executable not found:', loaderPath)
            return
        }

        const process = child_process.spawn(
            'powershell.exe',
            [
                '-ExecutionPolicy',
                'ByPass',
                '-Command',
                `& {Start-Process "${loaderPath}" -Verb RunAs -WorkingDirectory "${profile.getFolderPath()}"}`
            ],
            {
                stdio: ['ignore', 'pipe', 'pipe']
            }
        )

        process.stdout.setEncoding('utf8')
        process.stderr.setEncoding('utf8')

        process.stdout.on('data', (chunk) => {
            console.log('[MigotoLoader] - Loader Process - STDOUT: ' + chunk)
        })

        process.stderr.on('data', (chunk) => {
            console.log('[MigotoLoader] - Loader Process - STDERR: ' + chunk)
        })

        process.on('exit', (code) => {
            console.log('[MigotoLoader] - Loader Process - EXITED: ' + code)
        })

        process.unref()
    }

    private async setupConfig(profile: Profile, game: Game) {
        try {
            const rawConfig = await loadIni(path.resolve(profile.getFolderPath(), 'd3dx.ini'))
            if (Array.isArray(rawConfig)) {
                console.log("[MigotoLoader] Couldn't load d3dx.ini.")
                return false
            }

            const config = JSON.parse(JSON.stringify(rawConfig)) as Config
            if (config.Loader === undefined || config.Loader.target === undefined) {
                console.log('[MigotoLoader] Invalid d3dx.ini file.')
                return false
            }

            config.Loader.launch = path.resolve(game.installPath, config.Loader.target)
            fs.writeFileSync(path.resolve(profile.getFolderPath(), 'd3dx.ini'), stringifyIni(config))

            return true
        } catch {
            console.log('[MigotoLoader] Unknown error setup config.')
            return false
        }
    }
}
