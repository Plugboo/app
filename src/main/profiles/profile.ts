import { LoaderInstance } from '@common/types/loader'
import fs from 'node:fs'
import { Mod } from '@main/mods/mod'
import path from 'node:path'
import { ProfileRData } from '@common/types/profile'
import RendererDataSerializer from '@main/utils/renderer'
import { application } from '@main/app'
import GameManager from '@main/games/manager'

export class Profile extends RendererDataSerializer<ProfileRData> {
    public readonly id: string

    public readonly gameId: string

    public name: string

    public path: string

    public mods: Mod[]

    public loader: LoaderInstance | null

    constructor(id: string, gameId: string, name: string = '') {
        super()
        this.id = id
        this.gameId = gameId
        this.name = name
        this.path = ''
        this.mods = []
        this.loader = null
    }

    /**
     * Retrieves and loads mods from the specified mods directory.
     *
     * If the mods directory does not exist, it is automatically created.
     * Each mod is loaded by reading its corresponding `modinfo.json` file,
     * deserializing it into a Mod object, and adding it to the internal mods array.
     *
     * @note Duplicate mods (based on their ID) are skipped.
     */
    public loadMods() {
        this.mods = []

        try {
            const modsPath = path.join(this.path, 'mods')
            if (!fs.existsSync(modsPath)) {
                fs.mkdirSync(modsPath, { recursive: true })
            }

            const directories = fs
                .readdirSync(modsPath, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)

            for (const directory of directories) {
                const absolutePath = path.join(modsPath, directory)

                if (!fs.existsSync(path.join(absolutePath, 'modinfo.json'))) {
                    console.log('[Profile] Skipping folder:', directory)
                    continue
                }

                try {
                    const content = fs.readFileSync(path.join(absolutePath, 'modinfo.json'), {
                        encoding: 'utf8'
                    })
                    const json = JSON.parse(content)
                    const mod = Mod.deserialize(json)

                    if (this.mods.find((v) => v.id === mod.id)) {
                        console.log('[Profile] Found mod with an already used id.')
                        continue
                    }

                    console.log('[Profile] Got mod with name:', mod.name)
                    this.mods.push(mod)
                } catch (error) {
                    console.error('[Profile] Exception occurred while trying to load a mod:', error)
                }
            }
        } catch (error) {
            console.error('[Profile] Exception occurred while trying to get all mods: ', error)
        }
    }

    /**
     * Saves the profile data to the filesystem.
     * Ensures that the necessary directories exist before writing the data.
     */
    public save() {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path, { recursive: true })
        }

        const modsPath = path.join(this.path, 'mods')
        if (!fs.existsSync(modsPath)) {
            fs.mkdirSync(modsPath)
        }

        fs.writeFileSync(path.join(this.path, 'profile.json'), JSON.stringify(this.serialize()))
    }

    public installLoader() {
        if (this.loader === null) {
            console.log('[Profile] No loader instance found. Skipping installation.')
            return
        }

        const game = GameManager.entries.find((v) => v.info.id === this.gameId)
        if (game === undefined) {
            console.log('[Profile] Game not found. Skipping installation.')
            return
        }

        const loader = game.loaders.find((v) => v.id === this.loader.id)
        if (loader === undefined) {
            console.log('[Profile] Loader not found. Skipping installation.')
            return
        }

        const loaderPath = path.join(application.dataPath, 'loaders', this.gameId)
        if (!fs.existsSync(loaderPath)) {
            fs.mkdirSync(loaderPath, { recursive: true })
        }

        loader.installVersion(this, this.loader.version.version).then((result) => {
            if (result === true) {
                console.log('[Profile] Loader installed successfully.')
            } else {
                console.log('[Profile] Loader installation failed.')
            }
        })
    }

    public serializeRendererData(): ProfileRData {
        return {
            id: this.id,
            gameId: this.gameId,
            name: this.name,
            mods: this.mods.map((mod) => mod.serializeRendererData())
        }
    }

    /**
     * Serializes the current object into a plain JavaScript object representation.
     */
    public serialize(): any {
        return {
            id: this.id,
            gameId: this.gameId,
            name: this.name,
            loader:
                this.loader === null
                    ? null
                    : {
                          id: this.loader.id,
                          version: this.loader.version.version
                      }
        }
    }

    /**
     * Deserializes a given JSON object into a Profile instance.
     *
     * @param json - The JSON object containing the necessary profile properties.
     * @return The deserialized Profile instance.
     * @throws {Error} If the input JSON object does not have valid necessary properties.
     */
    public static deserialize(json: any): Profile {
        if (typeof json.id !== 'string') {
            throw new Error('Invalid profile id')
        }

        if (typeof json.gameId !== 'string') {
            throw new Error('Invalid game id')
        }

        if (typeof json.name !== 'string') {
            throw new Error('Invalid profile name')
        }

        const profile = new Profile(json.id, json.gameId, json.name)

        if (typeof json.loader === 'object') {
            if (typeof json.loader.id === 'string' && typeof json.loader.version === 'string') {
                profile.loader = {
                    id: json.loader.id,
                    version: json.loader.version
                }
            }
        }

        return profile
    }
}
