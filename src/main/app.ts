import {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    shell
} from 'electron'
import path from 'node:path'
import ConfigManager from './config'
import GamesManager from './games'
import ProfileManager from '@main/profiles'
import { GetCommentsOptions, Mod, SearchModsOptions } from '@common/service'
import IpcManager from '@main/ipcs/ipc'
import AppIpc from '@main/ipcs/appIpc'

class Application {
    private readonly _games: GamesManager

    private readonly _profiles: ProfileManager

    private readonly _dataPath: string

    private _window: BrowserWindow | null

    constructor() {
        this._dataPath = path.join(app.getPath('appData'), 'GachaForge', 'data')
        this._games = new GamesManager(this._dataPath)
        this._profiles = new ProfileManager(path.resolve(this._dataPath, 'profiles'))
        this._window = null

        /*
         * Quit when all windows are closed, except on macOS. There, it's common
         * for applications and their menu bar to stay active until the user quits
         * explicitly with Cmd + Q.
         */
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

        app.on('activate', async () => {
            /*
             * On OS X it's common to re-create a window in the app when the
             * dock icon is clicked and there are no other windows open.
             */
            if (BrowserWindow.getAllWindows().length === 0) {
                await this.createWindow()
            }
        })

        /*
         * Disable site reloading when not in development mode.
         */
        if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            app.on('browser-window-focus', function() {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                globalShortcut.register('CommandOrControl+R', () => {
                })
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                globalShortcut.register('F5', () => {
                })
            })

            app.on('browser-window-blur', function() {
                globalShortcut.unregister('CommandOrControl+R')
                globalShortcut.unregister('F5')
            })
        }
    }

    public async init() {
        if (!ConfigManager.loadConfig(this._dataPath)) {
            console.log('Application::init(): ConfigManager failed to load config.. quitting.')
            app.quit()
            return
        }

        if (!this._games.loadPaths()) {
            console.log('Application::init(): GamesManager failed to load paths.. quitting.')
            app.quit()
            return
        }

        if (!this._profiles.loadProfiles()) {
            console.log('Application::init(): ProfileManager failed to load profiles.. quitting.')
            app.quit()
            return
        }

        this.initIpcs()
        await this.createWindow()
    }

    private async createWindow() {
        if (this._window !== null) {
            return
        }

        this._window = new BrowserWindow({
            width: 1340,
            height: 700,
            minWidth: 1050,
            minHeight: 620,
            darkTheme: true,
            autoHideMenuBar: true,
            enableLargerThanScreen: true,
            frame: ConfigManager.config.titleBar === 'native',
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })

        this._window.webContents.setWindowOpenHandler((details) => {
            console.log('Link opening: ' + details.url)
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            await this._window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        } else {
            await this._window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
        }
    }

    private initIpcs() {
        IpcManager.registerHandler("app::titleBar", AppIpc.getTitleBarConfig)
        IpcManager.registerHandler("app:pickFile", AppIpc.showFileDialog)

        ipcMain.handle('mods::comments', async (_event, gameId: string, modId: string, options: GetCommentsOptions) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
                return []
            }

            return await game.services[0].getModComments(modId, options)
        })

        ipcMain.handle('mods::get', async (_event, gameId: string, modId: string) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
                return []
            }

            return await game.services[0].getMod(modId)
        })

        ipcMain.handle('mods::search', async (_event, gameId: string, options: SearchModsOptions) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
                return []
            }

            const records: Mod[] = []

            for (const service of game.services) {
                records.push(...(await service.searchMods(options)))
            }

            return records
        })

        ipcMain.handle('mods::categories', async (_event, gameId: string) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
                return []
            }

            return await game.services[0].getCategories()
        })

        ipcMain.handle('game::list', () => {
            return this._games.entries.map((v) => v.info)
        })

        ipcMain.handle('game::profiles', (_event, gameId: string) => {
            return JSON.stringify(
                this._profiles.entries
                    .entries()
                    .filter(([_, profile]) => profile.gameId === gameId)
                    .map(([_, profile]) => profile)
                    .toArray())
        })

        ipcMain.handle('game::profile', (_event, profileId: string) => {
            return JSON.stringify(
                this._profiles.entries
                    .entries()
                    .find(([_, profile]) => profile.id === profileId)[1])
        })

        ipcMain.handle('game::createProfile', (_event, gameId: string, name: string, loaderId: string, loaderVersion: string) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
                return false
            }

            const loader = game.loaders.find((v) => v.id === loaderId)
            if (loader === undefined) {
                return false
            }

            return this._profiles.createProfile(gameId, name, loader, loaderVersion)
        })

        ipcMain.handle('game::verifyGame', (_, gameId: string) => {
            const game = this._games.entries.find((conf) => conf.info.id === gameId)
            if (game === undefined) {
                return {
                    success: false,
                    reason: 'GAME_NOT_FOUND'
                }
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ipcMain.handle('game::setup', (_, gameId: string, path: string) => {
            const game = this._games.entries.find((v) => v.info.id === gameId)
            if (game === undefined) {
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
            this._games.savePaths()

            return {
                success: true
            }
        })

        ipcMain.handle('window::minimize', () => {
            this._window.minimize()
        })

        ipcMain.handle('window::maximize', () => {
            if (this._window.isMaximized()) {
                this._window.unmaximize()
            } else {
                this._window.maximize()
            }
        })

        ipcMain.handle('window::close', () => {
            this._window.close()
        })
    }
}

export const application = new Application()
