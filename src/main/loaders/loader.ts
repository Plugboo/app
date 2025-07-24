import { LoaderRData, LoaderVersion } from '@common/types/loader'
import RendererDataSerializer from '@main/utils/renderer'
import { Profile } from '@main/profiles/profile'

export interface LoaderVersionCache {
    timestamp: number
    versions: LoaderVersion[]
}

export class Loader extends RendererDataSerializer<LoaderRData> {
    public readonly id: string

    public readonly name: string

    public versions: LoaderVersion[]

    constructor(id: string, name: string) {
        super()
        this.id = id
        this.name = name
        this.versions = []
    }

    public async fetchVersions() {}

    public async installVersion(profile: Profile, version: string): Promise<boolean> {
        return false
    }

    public serializeRendererData(): LoaderRData {
        return {
            id: this.id,
            name: this.name,
            versions: this.versions
        }
    }
}
