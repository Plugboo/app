import { app, BrowserWindow, dialog, globalShortcut, Menu, shell, Tray } from 'electron'
import { compareVersions } from 'compare-versions'
import settings from 'electron-settings'
import path from 'node:path'
import { checkForInternet } from '@main/util/internet'
import { Settings } from '@main/application/settings'
import { GitHub } from '@main/util/github'
import { gachaForge } from '@main/main'
import IpcManager from './ipc'
import GameManager from '@main/game/manager'
import fs from 'node:fs'
import { Profile } from '@main/game/profile'
import { ProfileRData } from '@preload/types/profile'

export default class GachaForge {
    private readonly instanceLock: boolean

    private mainWindow: BrowserWindow | null

    private tray: Tray | null

    private settings: Settings

    private shouldExit: boolean

    private games: GameManager

    constructor() {
        this.instanceLock = app.requestSingleInstanceLock()
        this.mainWindow = null
        this.tray = null
        this.shouldExit = false
        this.games = new GameManager()

        /*
         * Default settings when starting GachaForge.
         */
        this.settings = {
            window: {
                titleBar: 'custom',
                exitOnClose: false
            },
            theme: 'dark'
        }

        /*
         * Allow only one instance of GachaForge to be running.
         */
        if (!this.instanceLock) {
            app.quit()
            console.error('Another instance is running, quitting.')
            return
        }

        app.on('ready', async () => {
            /*
             * Check for an active internet connection, so we can fetch for an available update from GitHub.
             * The check won't be run in development mode, as to not annoy developers and stop getting
             * rate-limited from GitHub.
             */
            checkForInternet().then(async (result) => {
                if (!result || !app.isPackaged) {
                    return
                }

                const availableRelease = await this.checkForUpdate()
                if (availableRelease === null) {
                    return
                }

                dialog.showMessageBoxSync({
                    type: 'info',
                    title: 'Update Available',
                    message: `An update is available (${availableRelease.tag_name}). Would you like to download it?`,
                    buttons: ['Yes', 'No'],
                    defaultId: 0,
                    cancelId: 1,
                    noLink: true,
                    detail: 'This update will automatically be installed when you restart GachaForge.'
                })

                // TODO: Add implementation for updating GachaForge to the latest version.
            })

            await this.init()
        })

        app.on('second-instance', () => {
            if (this.mainWindow === null) {
                return
            }

            this.mainWindow.show()
        })
    }

    /**
     * Initializes the main application window and settings.
     *
     * @return A promise that resolves when the initialization process is complete.
     */
    private async init() {
        this.initIpc()

        await this.initGames()
        await this.initSettings()

        this.readProfilesFromDisk()

        this.mainWindow = new BrowserWindow({
            title: 'GachaForge',
            width: 1340,
            height: 850,
            minWidth: 1050,
            minHeight: 620,
            autoHideMenuBar: true,
            enableLargerThanScreen: true,
            frame: this.settings.window.titleBar === 'native',
            show: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })

        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            console.log('[Application] Opening link: ' + details.url)
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            await this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        } else {
            await this.mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))

            /*
             * Disable site reloading when not in development mode.
             */
            app.on('browser-window-focus', function () {
                globalShortcut.register('CommandOrControl+R', () => {})
                globalShortcut.register('F5', () => {})
            })

            app.on('browser-window-blur', function () {
                globalShortcut.unregister('CommandOrControl+R')
                globalShortcut.unregister('F5')
            })
        }

        /*
         * Create an application tray when the application cannot be quit by closing the main window.
         */
        if (!this.settings.window.exitOnClose) {
            /*
             * Instead of closing the window, hide it.
             */
            this.mainWindow.on('close', (event) => {
                if (this.shouldExit) {
                    return
                }

                this.mainWindow.hide()
                event.preventDefault()
            })

            this.tray = new Tray(`${app.getAppPath()}/assets/icon.png`)
            this.tray.setContextMenu(
                Menu.buildFromTemplate([
                    { label: 'GachaForge', type: 'normal', enabled: false },
                    { type: 'separator' },
                    {
                        label: 'Open',
                        type: 'normal',
                        click: () => {
                            const window = gachaForge.mainWindow
                            if (window !== null) {
                                window.show()
                            }
                        }
                    },
                    {
                        label: 'Quit',
                        type: 'normal',
                        click: () => {
                            this.shouldExit = true
                            this.mainWindow.close()
                            app.quit()
                        }
                    }
                ])
            )
        }

        /*
         * FIX: Window showing a blank screen while loading the page.
         */
        this.mainWindow.show()
    }

    /**
     * Initializes all supported games.
     */
    private async initGames() {
        /*
         * Load every installation path from all supported games from the settings.json file.
         */
        for (const game of this.games.getGames()) {
            const key = `games.${game.info.id}.installPath`
            const value = await this.getConfigEntry(key)

            if (typeof value !== 'string' && value !== null) {
                await this.setConfigEntry(key, null)
                continue
            }

            game.installPath = value
        }
    }

    /**
     * Initializes application settings by fetching and validating configuration entries.
     * If an invalid configuration is found, it will be overwritten with the default value.
     */
    private async initSettings() {
        const titleBar = await this.getOrDefaultConfigEntry('window.titleBar', 'custom')
        const exitOnClose = await this.getOrDefaultConfigEntry('window.exitOnClose', false)
        const theme = await this.getOrDefaultConfigEntry('theme', 'dark')

        if (titleBar !== 'native' && titleBar !== 'custom') {
            await this.setConfigEntry('window.titleBar', 'custom')
        }

        if (theme !== 'light' && theme !== 'dark') {
            await this.setConfigEntry('window.theme', 'dark')
        }

        this.settings = {
            window: {
                titleBar: titleBar as 'native' | 'custom',
                exitOnClose: exitOnClose
            },
            theme: theme as 'light' | 'dark'
        }
    }

    /**
     * Initializes inter-process communication (IPC) handlers.
     */
    private initIpc() {
        IpcManager.init()
        IpcManager.registerHandler('window/minimize', () => {
            if (this.mainWindow === null) {
                return
            }

            this.mainWindow.minimize()
        })
        IpcManager.registerHandler('window/maximize', () => {
            if (this.mainWindow === null) {
                return
            }

            if (this.mainWindow.isMaximized()) {
                this.mainWindow.unmaximize()
            } else {
                this.mainWindow.maximize()
            }
        })
        IpcManager.registerHandler('window/close', () => {
            if (this.mainWindow === null) {
                return
            }

            this.mainWindow.close()
        })
        IpcManager.registerHandler('game/list', () => {
            return this.games.getGames().map((v) => v.info)
        })
        IpcManager.registerHandler('game/verify', (event) => {
            if (event.args.length !== 1) {
                return
            }

            const gameId = event.args[0]
            if (typeof gameId !== 'string') {
                return
            }

            const game = this.games.getGame(gameId)
            if (game === null) {
                return
            }

            if (game.installPath === null) {
                return {
                    success: false,
                    reason: 'GAME_NOT_INITIALIZED',
                    path: game.searchInstallation()
                }
            }

            return {
                success: true
            }
        })
        IpcManager.registerHandler('game/setup', async (event) => {
            if (event.args.length !== 2) {
                return
            }

            const gameId = event.args[0]
            const path = event.args[1]

            if (typeof gameId !== 'string' || typeof path !== 'string') {
                return
            }

            const game = this.games.getGame(gameId)
            if (game === null) {
                return {
                    success: false,
                    reason: 'GAME_NOT_FOUND'
                }
            }

            if (game.installPath !== null) {
                return {
                    success: false,
                    reason: 'GAME_ALREADY_INITIALIZED'
                }
            }

            if (!game.validatePath(path)) {
                return {
                    success: false,
                    reason: 'INVALID_PATH'
                }
            }

            game.installPath = path
            await this.setConfigEntry(`games.${game.info.id}.installPath`, path)

            return {
                success: true
            }
        })
        IpcManager.registerHandler('game/profiles', async (event) => {
            if (event.args.length !== 1) {
                return
            }

            const gameId = event.args[0]

            if (typeof gameId !== 'string') {
                return
            }

            const game = this.games.getGame(gameId)
            if (game === null) {
                return
            }

            return game.profiles.map((v) => {
                const data: ProfileRData = {
                    id: v.id,
                    gameId: v.gameId,
                    name: v.name,
                    mods: []
                }
                return data
            })
        })
        IpcManager.registerHandler('game/loaders', () => {
            return []
        })
        IpcManager.registerHandler('app/titlebar', () => {
            return this.settings.window.titleBar
        })
    }

    /**
     * Reads user profiles from the disk, validating their structure, and associates them with their respective games.
     * Ensures that the profiles directory exists, iterates over all subdirectories, and loads profile data if valid.
     */
    public readProfilesFromDisk() {
        const profilesPath = path.resolve(getAppDataPath(), 'profiles')

        if (!fs.existsSync(profilesPath)) {
            fs.mkdirSync(profilesPath, { recursive: true })
            return
        }

        const directories = fs
            .readdirSync(profilesPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name)

        for (const directory of directories) {
            const absolutePath = path.join(profilesPath, directory)

            if (!fs.existsSync(path.join(absolutePath, 'profile.json'))) {
                continue
            }

            try {
                const profile = Profile.readFromDisk(absolutePath)
                const game = this.games.getGame(profile.gameId)
                if (game === null) {
                    console.warn(`[Application] Failed to read profile from disk: ${directory} (Game not found)`)
                    continue
                }

                game.profiles.push(profile)
            } catch (exception) {
                console.error(`[Application] Failed to read profile from disk: ${directory}`)
                console.error(exception)
            }
        }
    }

    /**
     * Retrieves the configuration value for the specified key. If the key does not exist, the provided default value is saved and returned.
     *
     * @param key - The key to retrieve the configuration value for.
     * @param defaultValue - The default value to use if no value exists for the specified key.
     * @return A promise resolving to the saved or retrieved configuration value.
     */
    public async getOrDefaultConfigEntry<T>(key: string, defaultValue: T): Promise<T> {
        if (await settings.has(key)) {
            const savedValue = await settings.get(key)

            if (typeof defaultValue !== typeof savedValue) {
                console.warn(
                    `Overwriting setting '${key}' because the type of the new value (${typeof defaultValue}) is different from the type of the old value (${typeof savedValue}).`
                )

                await this.setConfigEntry(key, defaultValue)
                return defaultValue
            }

            return savedValue as T
        }

        await this.setConfigEntry(key, defaultValue)
        return defaultValue
    }

    /**
     * Retrieves the configuration entry for a specified key.
     *
     * @param key - The key associated with the configuration entry to retrieve.
     * @return A promise that resolves to the configuration entry if it exists, or undefined if it does not.
     */
    public async getConfigEntry(key: string): Promise<any> {
        if (await settings.has(key)) {
            return await settings.get(key)
        }

        return undefined
    }

    /**
     * Sets a configuration entry in the settings with the specified key and value.
     *
     * @param key - The key of the configuration entry to be set.
     * @param value - The value to associate with the specified key.
     * @return A promise that resolves when the configuration entry has been set.
     */
    public async setConfigEntry<T>(key: string, value: T): Promise<void> {
        await settings.set(key, value as any)
    }

    /**
     * Checks for updates by querying the GitHub releases API and comparing the version of the current application with the available releases.
     *
     * @return A Promise that resolves to the latest release with a newer version than the current application version
     * or null if no newer release is found or if an error occurs during the process.
     */
    private async checkForUpdate(): Promise<GitHub.Release | null> {
        try {
            const releases = await GitHub.getReleases('ZickZenni', 'GachaForge')
            const newerReleases: GitHub.Release[] = []

            for (const release of releases) {
                const releaseVersion = release.tag_name

                if (compareVersions(releaseVersion, app.getVersion()) === 1) {
                    newerReleases.push(release)
                }
            }

            /*
             * GachaForge is up to date or no releases were found.
             */
            if (newerReleases.length === 0) {
                return null
            }

            /*
             * Sort every newer release and get back the newest of them ALL.
             */
            return newerReleases.sort((a, b) => -compareVersions(a.tag_name, b.tag_name))[0]
        } catch (exception) {
            return null
        }
    }
}

/**
 * Retrieves the application data path for the current application.
 * Combines the system's application data directory with the application's name.
 *
 * @returns The resolved path to the application's data directory.
 */
export const getAppDataPath = (): string => path.resolve(app.getPath('appData'), app.getName())
