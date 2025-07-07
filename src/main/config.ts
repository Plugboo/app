import fs from 'node:fs'
import pathlib from 'node:path'

interface Config {
    titleBar: 'custom' | 'native'
}

// TODO: Change to non-singleton class.
export default class ConfigManager {
    public static config: Config

    public static loadConfig(path: string) {
        try {
            const filePath = pathlib.join(path, 'config.json')

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true })
            }

            if (!fs.existsSync(filePath)) {
                const defaultConfig: Config = {
                    titleBar: 'custom'
                }

                console.log('ConfigManager::loadConfig(): Creating config file..')
                fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2), {
                    encoding: 'utf8'
                })
            }

            const data = fs.readFileSync(filePath, {
                encoding: 'utf8'
            })
            const json = JSON.parse(data)
            ConfigManager.config = this.serializeConfig(json)

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
            titleBar: 'custom'
        }

        if (typeof data.titleBar === 'string') {
            if (data.titleBar === 'custom' || data.titleBar === 'native') {
                config.titleBar = data.titleBar
            } else {
                config.titleBar = 'custom'
            }
        }

        return config
    }
}
