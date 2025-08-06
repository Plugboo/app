import { Profile } from '@main/game/profile'

export interface LoaderVersion {
    version: string
    file: LoaderFile
}

export interface LoaderFile {
    name: string
    url: string
}

export interface LoaderInstance {
    loaderId: string
    version: LoaderVersion
}

export class Loader {
    public readonly id: string

    public readonly name: string

    public versions: LoaderVersion[]

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
        this.versions = []
    }

    /**
     * Fetches available versions from the data source.
     */
    public async fetchVersions() {
        throw new Error('Not implemented')
    }

    /**
     * Installs the specified loader associated with the provided profile.
     *
     * @param profile - The profile object containing details about the loader to be installed.
     */
    public async installVersion(profile: Profile) {
        throw new Error('Not implemented')
    }

    public validateInstallation(profile: Profile): boolean {
        throw new Error('Not implemented')
    }
}
