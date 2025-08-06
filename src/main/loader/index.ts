import { LoaderVersion } from '@preload/types/loader'

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
    public async fetchVersions() {}
}
