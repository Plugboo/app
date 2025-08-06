import fs from 'node:fs'
import path from 'node:path'
import { getAppDataPath } from '@main/application'
import { LoaderInstance } from '@preload/types/loader'

export class Profile {
    public readonly id: string

    public readonly gameId: string

    public name: string

    public loader: LoaderInstance | null

    constructor(id: string, gameId: string) {
        this.id = id
        this.gameId = gameId
        this.name = ''
        this.loader = null
    }

    /**
     * Writes the profile's data to the disk. Ensures the directory structure exists before writing files.
     */
    public writeToDisk() {
        console.log(`[Profile] Writing profile to disk: ${this.id}`)

        const diskPath = path.join(getAppDataPath(), 'profiles', this.id)
        if (!fs.existsSync(diskPath)) {
            console.log(`[Profile] Creating directory: ${diskPath}`)
            fs.mkdirSync(diskPath, { recursive: true })
        }

        const modsPath = path.join(diskPath, 'mods')
        if (!fs.existsSync(modsPath)) {
            console.log(`[Profile] Creating directory: ${modsPath}`)
            fs.mkdirSync(modsPath)
        }

        fs.writeFileSync(path.join(diskPath, 'profile.json'), JSON.stringify(this.serializeDisk()))
    }

    /**
     * Reads a profile object from a file located in the specified folder path.
     *
     * @param folderPath The path to the folder containing the profile JSON file.
     * @return The Profile object parsed from the JSON file.
     * @throws Error if the folder does not exist, if the profile file is not found, or if the profile version is unsupported.
     */
    public static readFromDisk(folderPath: string): Profile {
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Folder does not exist`)
        }

        if (!fs.existsSync(path.join(folderPath, 'profile.json'))) {
            throw new Error(`Profile file does not exist`)
        }

        const data = fs.readFileSync(path.join(folderPath, 'profile.json'), {
            encoding: 'utf8'
        })
        const json = JSON.parse(data)

        /*
         * NOTE: We change this when we have version 2 or higher available.
         */
        if (!json.__version || json.__version !== 1) {
            throw new Error(`Unsupported profile version: ${json.__version}`)
        }

        return Profile.parseVersion1(json)
    }

    /**
     * Parses the provided data to create a `Profile` instance while validating its structure.
     *
     * @param data - The data object containing profile information to be parsed.
     * @return A `Profile` instance created with the validated `id`, `gameId`, and `name` from the provided data.
     * @throws Error if any required field is missing or has an invalid type.
     */
    private static parseVersion1(data: any): Profile {
        if (typeof data.id !== 'string') {
            throw new Error(`Invalid profile ID: ${data.id}`)
        }

        if (typeof data.gameId !== 'string') {
            throw new Error(`Invalid game ID: ${data.gameId}`)
        }

        if (typeof data.name !== 'string') {
            throw new Error(`Invalid profile name: ${data.name}`)
        }

        const profile = new Profile(data.id, data.gameId)
        profile.name = data.name
        return profile
    }

    /**
     * Serializes the current object into a plain JavaScript object representation.
     */
    private serializeDisk(): any {
        return {
            __version: 1,
            id: this.id,
            gameId: this.gameId,
            name: this.name,
            loader: this.loader
                ? {
                      id: this.loader.id,
                      version: this.loader.version.version
                  }
                : null
        }
    }
}
