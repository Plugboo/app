import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import ConfigManager from './config'
import { GameInformation } from '../common/game'
import fs from 'node:fs'
import HoyoPlay from './hoyoplay'

class Application {
  private readonly _games: GameInformation[]

  private _window: BrowserWindow | null

  private _currentGame: GameInformation | null

  constructor() {
    this._games = [{
      id: 'genshin_impact',
      name: 'Genshin Impact',
      banner: 'https://images.gamebanana.com/img/banners/games/63388a097a525.jpg?opt=w300',
      icon: 'https://cdn2.steamgriddb.com/icon_thumb/54795ec619ebda94c86d00184861c96f.png',
      developer: 'miHoYo'
    },
      {
        id: 'honkai_star_rail',
        name: 'Honkai: Star Rail',
        banner: 'https://images.gamebanana.com/img/banners/games/64ccf63a5ceb7.png?opt=w300',
        icon: 'https://cdn2.steamgriddb.com/icon_thumb/e52da5a31de788599378924f0e639557.png',
        developer: 'miHoYo'
      },
      {
        id: 'zenless_zone_zero',
        name: 'Zenless Zone Zero',
        banner: 'https://optimg.gamebanana.com/img/banners/games/66868cbc731d2.jpg?opt=w300',
        icon: 'https://cdn2.steamgriddb.com/icon_thumb/7029a498c4f596f73b35504df9bab02a.png',
        developer: 'miHoYo'
      }
      // {
      //   id: 'wuthering_waves',
      //   name: 'Wuthering Waves',
      //   banner: 'https://images.gamebanana.com/img/banners/games/665497f1ee42f.png?opt=w300',
      //   icon: 'https://cdn2.steamgriddb.com/icon_thumb/9d435d2e017f7a7384f4e1c6a6f2d169.png',
      //   developer: 'Kuro Games'
      // }
    ]
    app.setPath('appData', path.join(app.getPath('appData'), 'GachaForge'))
    this._window = null
    this._currentGame = null

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
  }

  public async init() {
    if (!ConfigManager.loadConfig(app.getPath('appData'), this._games)) {
      console.log('Application::init(): ConfigManager failed to load config.. quitting.')
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
      width: 1300,
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
      this._window.webContents.openDevTools()
    } else {
      await this._window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
    }
  }

  private initIpcs() {
    ipcMain.handle('app::titleBar', () => {
      return ConfigManager.config.titleBar
    })

    ipcMain.handle('game::list', () => {
      return this._games
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

      const game = this._games.find((game) => game.id === gameId)
      const config = ConfigManager.config.games.find(conf => conf.id === gameId)

      if (game === undefined || config === undefined) {
        return {
          success: false,
          reason: 'GAME_NOT_FOUND'
        }
      }

      if (config.installPath === null) {
        if (game.developer === 'miHoYo') {
          let gameExe = '_____'

          switch (game.id) {
            case 'genshin_impact':
              gameExe = 'GenshinImpact.exe'
              break
            case 'honkai_star_rail':
              gameExe = 'StarRail.exe'
              break
            case 'zenless_zone_zero':
              gameExe = 'ZenlessZoneZero.exe'
              break
          }

          const hoyoInstallation = HoyoPlay.getInstallations().find((install) => install.gameInstallStatus.gameExeName === gameExe)
          if (hoyoInstallation === undefined) {
            return {
              success: false,
              reason: 'GAME_NOT_FOUND'
            }
          }

          if (hoyoInstallation.installPath.length === 0) {
            return {
              success: false,
              reason: 'GAME_NOT_INSTALLED'
            }
          }

          if (hoyoInstallation.downloading) {
            return {
              success: false,
              reason: 'GAME_IS_CURRENTLY_DOWNLOADING'
            }
          }

          return {
            success: false,
            reason: 'GAME_NOT_INITIALIZED',
            path: hoyoInstallation.installPath
          }
        }

        return {
          success: false,
          reason: 'GAME_NOT_INITIALIZED',
          path: ''
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
      const config = ConfigManager.config.games.find(conf => conf.id === gameId)
      if (config === undefined) {
        return {
          success: false,
          reason: 'GAME_NOT_FOUND'
        }
      }

      if (config.installPath !== null) {
        return {
          success: false,
          reason: 'GAME_ALREADY_INITIALIZED'
        }
      }

      switch (gameId) {
        case 'genshin_impact': {
          if (!this.validateGenshinImpactPath(path)) {
            return {
              success: false,
              reason: 'INVALID_PATH'
            }
          }
          break
        }
        case 'honkai_star_rail': {
          if (!this.validateHonkaiStarRailPath(path)) {
            return {
              success: false,
              reason: 'INVALID_PATH'
            }
          }
          break
        }
        case 'zenless_zone_zero': {
          if (!this.validateZenlessZoneZeroPath(path)) {
            return {
              success: false,
              reason: 'INVALID_PATH'
            }
          }
          break
        }
        default:
          return {
            success: false,
            reason: 'INVALID_PATH'
          }
      }

      config.installPath = path
      ConfigManager.saveConfig(app.getPath('appData'))
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

  private validateGenshinImpactPath(installPath: string): boolean {
    const pathsNeedExist: string[] = [
      installPath,
      path.join(installPath, 'GenshinImpact.exe'),
      path.join(installPath, 'HoYoKProtect.sys'),
      path.join(installPath, 'mhypbase.dll'),
      path.join(installPath, 'GenshinImpact_Data/')
    ]

    for (const path of pathsNeedExist) {
      if (!fs.existsSync(path)) {
        return false
      }
    }

    return true
  }

  private validateHonkaiStarRailPath(installPath: string): boolean {
    const pathsNeedExist: string[] = [
      installPath,
      path.join(installPath, 'StarRail.exe'),
      path.join(installPath, 'HoYoKProtect.sys'),
      path.join(installPath, 'mhypbase.dll'),
      path.join(installPath, 'StarRail_Data/')
    ]

    for (const path of pathsNeedExist) {
      if (!fs.existsSync(path)) {
        return false
      }
    }

    return true
  }

  private validateZenlessZoneZeroPath(installPath: string): boolean {
    const pathsNeedExist: string[] = [
      installPath,
      path.join(installPath, 'ZenlessZoneZero.exe'),
      path.join(installPath, 'HoYoKProtect.sys'),
      path.join(installPath, 'mhypbase.dll'),
      path.join(installPath, 'ZenlessZoneZero_Data/')
    ]

    for (const path of pathsNeedExist) {
      if (!fs.existsSync(path)) {
        return false
      }
    }

    return true
  }
}

export const application = new Application()
