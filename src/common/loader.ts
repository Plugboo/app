export interface LoaderVersion {
    version: string
    devFile: LoaderFile
    playFile: LoaderFile
}

export interface LoaderFile {
    name: string
    url: string
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

    public async fetchVersions() {
    }
}