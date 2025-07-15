import { app, BrowserWindow, BrowserWindowConstructorOptions, globalShortcut, shell } from 'electron'
import path from 'node:path'
import ConfigManager from './config'
import ProfileManager from '@main/profiles/manager'
import IpcManager from '@main/ipcs/ipc'
import AppIpc from '@main/ipcs/appIpc'
import { IpcChannel } from '@common/types/ipc'
import ModIpc from '@main/ipcs/modIpc'
import WindowIpc from '@main/ipcs/windowIpc'
import GameIpc from '@main/ipcs/gameIpc'
import GameManager from '@main/games/manager'

class Application {
    public readonly dataPath: string

    public window: BrowserWindow | null

    constructor() {
        this.dataPath = path.join(app.getPath('appData'), 'GachaForge', 'data')
        this.window = null

        GameManager.pathsFile = path.join(this.dataPath, 'paths.json')
        ProfileManager.path = path.join(this.dataPath, 'profiles')

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

        app.on('before-quit', async () => {
            console.log('[Application] Before quitting...')
            {
                const values = Object.values(IpcChannel)
                for (const channel in Object.keys(IpcChannel)) {
                    IpcManager.removeHandler(values[channel])
                }
            }
        })

        /*
         * Disable site reloading when not in development mode.
         */
        if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            app.on('browser-window-focus', function () {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                globalShortcut.register('CommandOrControl+R', () => {})
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                globalShortcut.register('F5', () => {})
            })

            app.on('browser-window-blur', function () {
                globalShortcut.unregister('CommandOrControl+R')
                globalShortcut.unregister('F5')
            })
        }
    }

    public async init() {
        if (!ConfigManager.loadConfig(this.dataPath)) {
            console.log('[Application] ConfigManager failed to load config.. quitting.')
            app.quit()
            return
        }

        if (!GameManager.loadPaths()) {
            console.log('[Application] GameManager failed to load paths.. quitting.')
            app.quit()
            return
        }

        if (!ProfileManager.loadProfiles()) {
            console.log('[Application] ProfileManager failed to load profiles.. quitting.')
            app.quit()
            return
        }

        /*
         * Fetch all versions of all loaders from all games.
         */
        for (const game of GameManager.entries) {
            for (const loader of game.loaders) {
                loader.fetchVersions().then()
            }
        }

        this.initIpcs()
        await this.createWindow()
    }

    private async createWindow() {
        if (this.window !== null) {
            return
        }

        const options: BrowserWindowConstructorOptions = {
            width: 1340,
            height: 850,
            minWidth: 1050,
            minHeight: 620,
            darkTheme: true,
            autoHideMenuBar: true,
            enableLargerThanScreen: true,
            frame: ConfigManager.config.titleBar === 'native',
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }

        console.log('[Application] Creating window with options:\n', options)
        this.window = new BrowserWindow(options)

        this.window.webContents.setWindowOpenHandler((details) => {
            console.log('[Application] Opening link: ' + details.url)
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            await this.window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        } else {
            await this.window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
        }
    }

    private initIpcs() {
        console.log('[Application] Initializing IPCs..')
        IpcManager.registerHandler(IpcChannel.App_TitleBar, AppIpc.getTitleBarConfig)
        IpcManager.registerHandler(IpcChannel.App_PickFile, AppIpc.showFileDialog)
        IpcManager.registerHandler(IpcChannel.Mods_GetMod, ModIpc.getMod)
        IpcManager.registerHandler(IpcChannel.Mods_GetComments, ModIpc.getComments)
        IpcManager.registerHandler(IpcChannel.Mods_Search, ModIpc.searchMods)
        IpcManager.registerHandler(IpcChannel.Mods_GetCategories, ModIpc.getCategories)
        IpcManager.registerHandler(IpcChannel.Window_Minimize, WindowIpc.minimize)
        IpcManager.registerHandler(IpcChannel.Window_Maximize, WindowIpc.maximize)
        IpcManager.registerHandler(IpcChannel.Window_Close, WindowIpc.close)
        IpcManager.registerHandler(IpcChannel.Game_NewsAll, GameIpc.getNewsOfAll)
        IpcManager.registerHandler(IpcChannel.Game_List, GameIpc.listGames)
        IpcManager.registerHandler(IpcChannel.Game_GetProfiles, GameIpc.getProfiles)
        IpcManager.registerHandler(IpcChannel.Game_GetProfile, GameIpc.getProfile)
        IpcManager.registerHandler(IpcChannel.Game_Verify, GameIpc.verify)
        IpcManager.registerHandler(IpcChannel.Game_Setup, GameIpc.setup)
        IpcManager.registerHandler(IpcChannel.Game_CreateProfile, GameIpc.createProfile)
        IpcManager.registerHandler(IpcChannel.Game_DeleteProfile, GameIpc.deleteProfile)
        IpcManager.registerHandler(IpcChannel.Game_Loaders, GameIpc.getLoaders)
    }
}

export const application = new Application()
