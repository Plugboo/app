import fs from 'node:fs'
import path from 'node:path'
import { LoaderVersion } from '@common/loader'

const REQUIRED_MODS_JSON_OBJECTS: string[] = [
    'id',
    'name'
]

export interface GameInformation {
    id: string
    name: string
    banner: string
    icon: string
    developer: string
}

export class GameProfile {
    public readonly id: string

    public readonly gameId: string

    public path: string

    public name: string

    public mods: GameMod[]

    public loader: LoaderVersion | null

    constructor(id: string = '', gameId: string = '') {
        this.id = id
        this.gameId = gameId
        this.path = ""
        this.name = ''
        this.mods = []
        this.loader = null
    }

    public getMods() {
        this.mods = []

        try {
            const modsPath = path.join(this.path, 'mods')
            if (!fs.existsSync(modsPath)) {
                fs.mkdirSync(modsPath, { recursive: true })
            }

            const directories = fs.readdirSync(modsPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)

            directoryLoop: for (const directory of directories) {
                const absolutePath = path.join(modsPath, directory)

                if (!fs.existsSync(path.join(absolutePath, 'modinfo.json'))) {
                    continue
                }

                try {
                    const content = fs.readFileSync(path.join(absolutePath, 'modinfo.json'), {
                        encoding: 'utf8'
                    })
                    const json = JSON.parse(content)
                    for (const key of REQUIRED_MODS_JSON_OBJECTS) {
                        if (typeof json[key] === 'undefined') {
                            console.log(`GameProfile::getMods(): Found mod with invalid structure: Missing key in modinfo.json '${key}'`)
                            continue directoryLoop
                        }
                    }

                    const mod: GameMod = Object.assign(new GameMod(), json)
                    if (this.mods.find((v) => v.id === mod.id)) {
                        console.log('GameProfile::getMods(): Found mod with an already used id.')
                        continue
                    }

                    console.log('GameProfile::getMods(): Got mod with name:', mod.name)
                    this.mods.push(mod)
                } catch (error) {
                    console.error('GameProfile::getMods(): Exception occurred while trying to load a mod:', error)
                }
            }
        } catch (error) {
            console.error('GameProfile::getMods(): Exception occurred while trying to get all mods: ', error)
        }
    }

    public toProfilesJson() {
        return {
            id: this.id,
            gameId: this.gameId,
            name: this.name,
        }
    }
}

export class GameMod {
    id: string
    name: string
    author: string
    version: string
    enabled: boolean
}