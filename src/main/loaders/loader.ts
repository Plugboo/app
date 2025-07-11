import { LoaderRData, LoaderVersion } from '@common/loader'
import RendererDataSerializer from '@main/utils/renderer'

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

    public async fetchVersions() {
    }

    serializeRendererData(): LoaderRData {
        return {
            id: this.id,
            name: this.name,
            versions: this.versions
        }
    }
}