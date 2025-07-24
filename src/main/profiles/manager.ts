import fs from 'node:fs'
import path from 'node:path'
import { v4 } from 'uuid'
import { LoaderVersion } from '@common/types/loader'
import { Profile } from '@main/profiles/profile'
import { Loader } from '@main/loaders/loader'

export default class ProfileManager {
    public static path: string

    public static entries: Map<string, Profile> = new Map()

    public static loadProfiles(): boolean {
        console.log('[ProfileManager] Loading profiles..')
        ProfileManager.entries.clear()

        try {
            if (!fs.existsSync(ProfileManager.path)) {
                fs.mkdirSync(ProfileManager.path, { recursive: true })
            }

            const directories = fs
                .readdirSync(ProfileManager.path, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)

            for (const directory of directories) {
                const absolutePath = path.join(ProfileManager.path, directory)

                if (!fs.existsSync(path.join(absolutePath, 'profile.json'))) {
                    continue
                }

                try {
                    const content = fs.readFileSync(path.join(absolutePath, 'profile.json'), {
                        encoding: 'utf8'
                    })
                    const json = JSON.parse(content)
                    const profile = Profile.deserialize(json)
                    profile.path = absolutePath

                    if (ProfileManager.entries.has(profile.id)) {
                        console.log('[ProfileManager] Found profile with an already used id.')
                        continue
                    }

                    profile.loadMods()

                    console.log('[ProfileManager] Loaded profile with name:', profile.name)
                    ProfileManager.entries.set(profile.id, profile)
                } catch (error) {
                    console.error('[ProfileManager] Exception occurred while trying to load a profile:', error)
                }
            }
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public static createProfile(gameId: string, name: string, loader: Loader, version: LoaderVersion) {
        try {
            if (!fs.existsSync(ProfileManager.path)) {
                fs.mkdirSync(ProfileManager.path, { recursive: true })
            }

            const absolutePath = path.join(ProfileManager.path, name)
            if (fs.existsSync(absolutePath)) {
                return false
            }

            const profile = new Profile(v4(), gameId)
            profile.path = absolutePath
            profile.name = name
            profile.loader = {
                id: loader.id,
                version: version
            }
            profile.save()
            profile.installLoader()

            ProfileManager.entries.set(profile.id, profile)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}
