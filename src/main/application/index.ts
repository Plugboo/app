import { app, BrowserWindow, dialog, globalShortcut, Menu, shell, Tray } from 'electron'
import { compareVersions } from 'compare-versions'
import settings from 'electron-settings'
import path from 'node:path'
import { checkForInternet } from '@main/util/internet'
import { Settings } from '@main/application/settings'
import { GitHub } from '@main/types/github'
import { gachaForge } from '@main/main'

export default class GachaForge {
    private readonly instanceLock: boolean

    private mainWindow: BrowserWindow | null

    private tray: Tray | null

    private settings: Settings

    private shouldExit: boolean

    constructor() {
        this.instanceLock = app.requestSingleInstanceLock()
        this.mainWindow = null
        this.tray = null
        this.shouldExit = false

        /*
         * Default settings when starting GachaForge.
         */
        this.settings = {
            window: {
                titleBar: 'custom',
                theme: 'dark',
                exitOnClose: false
            }
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
        await this.initSettings()

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
     * Initializes application settings by fetching and validating configuration entries.
     * If an invalid configuration is found, it will be overwritten with the default value.
     *
     * @return A promise that resolves when the settings initialization is complete.
     */
    private async initSettings() {
        const titleBar = await this.getOrDefaultConfigEntry('window.titleBar', 'custom')
        const theme = await this.getOrDefaultConfigEntry('window.theme', 'dark')
        const exitOnClose = await this.getOrDefaultConfigEntry('window.exitOnClose', false)

        if (titleBar !== 'native' && titleBar !== 'custom') {
            await this.setConfigEntry('window.titleBar', 'custom')
        }

        if (theme !== 'light' && theme !== 'dark') {
            await this.setConfigEntry('window.theme', 'dark')
        }

        this.settings = {
            window: {
                titleBar: titleBar as 'native' | 'custom',
                theme: theme as 'light' | 'dark',
                exitOnClose: exitOnClose
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
