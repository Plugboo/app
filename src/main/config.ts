import fs from 'node:fs'
import pathlib from 'node:path'
import { GameInformation } from '../common/game'

interface Config {
  titleBar: "custom" | "native"
  games: GameConfig[]
}

interface GameConfig {
  id: string
  installPath: string | null
}

export default class ConfigManager {
  public static config: Config

  public static loadConfig(path: string, games: GameInformation[]) {
    try {
      const filePath = pathlib.join(path, 'config.json')

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
      }

      if (!fs.existsSync(filePath)) {
        const empty: Config = {
          titleBar: 'custom',
          games: games.map((game) => (
            {
              id: game.id,
              installPath: null
            }
          ))
        }

        console.log('ConfigManager::loadConfig(): Creating config file..')
        fs.writeFileSync(filePath, JSON.stringify(empty, null, 2), {
          encoding: 'utf8'
        })
      }

      const data = fs.readFileSync(filePath, {
        encoding: 'utf8'
      })
      const json = JSON.parse(data)
      ConfigManager.config = this.serializeConfig(json)

      for (const game of games) {
        if (!ConfigManager.config.games.find(g => g.id === game.id)) {
          ConfigManager.config.games.push({ id: game.id, installPath: null })
        }
      }

      this.saveConfig(path)
      return true
    } catch (error) {
      console.error('ConfigManager::loadConfig(): Exception occurred while loading config: ', error)
      return false
    }
  }

  public static saveConfig(path: string) {
    try {
      fs.writeFileSync(pathlib.join(path, 'config.json'), JSON.stringify(ConfigManager.config, null, 2), {
        encoding: 'utf8'
      })
    } catch (error) {
      console.error('ConfigManager::saveConfig(): Exception occurred while saving config: ', error)
    }
  }

  private static serializeConfig(data: any): Config {
    const config: Config = {
      titleBar: 'custom',
      games: []
    }

    if (typeof data.titleBar === 'string') {
      if (data.titleBar === 'custom' || data.titleBar === 'native') {
        config.titleBar = data.titleBar
      } else {
        config.titleBar = 'custom'
      }
    }

    if (Array.isArray(data.games)) {
      data.games.forEach((entry: any) => {
        if ((typeof entry.installPath === 'string' || entry.installPath === null) && typeof entry.id === 'string') {
          config.games.push({
            id: entry.id,
            installPath: entry.installPath
          })
        }
      })
    }

    return config
  }
}