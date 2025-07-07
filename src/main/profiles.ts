import fs from 'node:fs'
import path from 'node:path'
import { GameProfile } from '@common/games'
import { v4 } from 'uuid'
import { Loader } from '@main/loader'

const REQUIRED_JSON_OBJECTS: string[] = [
    'id',
    'gameId',
    'name'
]

export default class ProfileManager {
    private readonly _path: string

    public entries: Map<string, GameProfile>

    constructor(path: string) {
        this._path = path
        this.entries = new Map()
    }

    public loadProfiles(): boolean {
        try {
            if (!fs.existsSync(this._path)) {
                fs.mkdirSync(this._path, { recursive: true })
            }

            const directories = fs.readdirSync(this._path, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)

            directoryLoop: for (const directory of directories) {
                const absolutePath = path.join(this._path, directory)

                if (!fs.existsSync(path.join(absolutePath, 'profile.json'))) {
                    continue
                }

                try {
                    const content = fs.readFileSync(path.join(absolutePath, 'profile.json'), {
                        encoding: 'utf8'
                    })
                    const json = JSON.parse(content)
                    for (const key of REQUIRED_JSON_OBJECTS) {
                        if (typeof json[key] === 'undefined') {
                            console.log(`ProfileManager::loadProfiles(): Found profile with invalid structure: Missing key in profile.json '${key}'`)
                            continue directoryLoop
                        }
                    }

                    const profile: GameProfile = Object.assign(new GameProfile(), json)
                    profile.path = absolutePath

                    if (this.entries.has(profile.id)) {
                        console.log('ProfileManager::loadProfiles(): Found profile with an already used id.')
                        continue
                    }

                    profile.getMods()

                    console.log('ProfileManager::loadProfiles(): Loaded profile with name:', profile.name)
                    this.entries.set(profile.id, profile)
                } catch (error) {
                    console.error('ProfileManager::loadProfiles(): Exception occurred while trying to load a profile:', error)
                }
            }
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public createProfile(gameId: string, name: string, loader: Loader, loaderVersion: string) {
        try {
            if (!fs.existsSync(this._path)) {
                fs.mkdirSync(this._path, { recursive: true })
            }

            const absolutePath = path.join(this._path, name)
            if (fs.existsSync(absolutePath)) {
                return false
            }

            const profile = new GameProfile(v4(), gameId)
            profile.path = absolutePath
            profile.name = name
            profile.loader = {
                id: loader.id,
                version: loaderVersion
            }

            fs.mkdirSync(absolutePath)
            fs.writeFileSync(path.join(absolutePath, 'profile.json'), JSON.stringify(profile.toProfilesJson()))
            this.entries.set(profile.id, profile)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}