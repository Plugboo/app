import { app, BrowserWindow, ipcMain, globalShortcut, dialog, OpenDialogOptions } from 'electron'
import path from 'node:path'
import ConfigManager from './config'
import GamesManager, { Game } from './games'
import { GameProfile } from '@common/games'
import ProfileManager from '@main/profiles'

class Application {
  private readonly _games: GamesManager

  private readonly _profiles: ProfileManager

  private readonly _dataPath: string

  private _window: BrowserWindow | null

  private _currentGame: Game | null

  private _currentProfile: GameProfile | null

  constructor() {
    this._dataPath = path.join(app.getPath('appData'), 'GachaForge', 'data')
    this._games = new GamesManager(this._dataPath)
    this._profiles = new ProfileManager(path.resolve(this._dataPath, 'profiles'))
    this._window = null
    this._currentGame = null
    this._currentProfile = null

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

    // if (!this._games.loadProfiles()) {
    //   console.log('Application::init(): GamesManager failed to load profiles.. quitting.')
    //   app.quit()
    //   return
    // }

    if (!this._profiles.loadProfiles()) {

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
      minWidth: 800,
      minHeight: 500,
      darkTheme: true,
      autoHideMenuBar: true,
      enableLargerThanScreen: true,
      frame: ConfigManager.config.titleBar === 'native',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      await this._window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    } else {
      await this._window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
    }
  }

  private initIpcs() {
    ipcMain.handle('app::titleBar', () => {
      return ConfigManager.config.titleBar
    })

    ipcMain.handle('app:pickFile', async (_, options: OpenDialogOptions) => {
      return await dialog.showOpenDialog(options)
    })

    ipcMain.handle('game::list', () => {
      return this._games.entries.map((v) => v.info)
    })

    ipcMain.handle('game::profiles', () => {
      if (this._currentGame === null) {
        return
      }

      return JSON.stringify(
        this._profiles.entries
          .entries()
          .filter(([_, profile]) => profile.gameId === this._currentGame.info.id)
          .map(([_, profile]) => profile)
          .toArray())
    })

    ipcMain.handle('game::selectProfile', (_, id: string) => {
      if (id.length === 0) {
        if (this._currentProfile !== null) {
          console.log('Application ipc (game::selectProfile): Reset selected profile')
        }

        this._currentProfile = null
        return true
      }

      const profile = this._profiles.entries.get(id)
      this._currentProfile = profile ?? null
      console.log('Application ipc (game::selectProfile): Selected profile: ' + id)
      return this._currentProfile !== null
    })

    ipcMain.handle('game::currentProfile', () => {
      return JSON.stringify(this._currentProfile)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('game::select', (_, gameId) => {
      if (gameId.length === 0) {
        if (this._currentGame !== null) {
          console.log('Application ipc (game::select): Reset selected game')
        }

        this._currentGame = null
        return {
          success: true
        }
      }

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

      console.log('Application ipc (game::select): Selected game: ' + gameId)
      this._currentGame = game
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
