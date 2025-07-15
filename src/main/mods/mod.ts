import RendererDataSerializer from '@main/utils/renderer'
import { ModRData } from '@common/types/mod'

export class Mod extends RendererDataSerializer<ModRData> {
    public readonly id: string

    public readonly name: string

    public author: string

    public version: string

    public enabled: boolean

    constructor(id: string, name: string) {
        super()
        this.id = id
        this.name = name
        this.author = ''
        this.version = ''
        this.enabled = true
    }

    serializeRendererData(): ModRData {
        return {
            id: this.id,
            name: this.name,
            author: this.author,
            version: this.version,
            enabled: this.enabled
        }
    }

    /**
     * Serializes the current object into a plain JavaScript object representation.
     */
    public serialize(): any {
        return {
            id: this.id,
            name: this.name,
            author: this.author,
            version: this.version
        }
    }

    /**
     * Deserializes a given JSON object into a Mod instance.
     *
     * @param json - The JSON object containing the necessary mod properties.
     * @return The deserialized Mod instance.
     * @throws {Error} If the input JSON object does not have a valid id or name.
     */
    public static deserialize(json: any): Mod {
        if (typeof json.id !== 'string') {
            throw new Error('Invalid mod id')
        }

        if (typeof json.name !== 'string') {
            throw new Error('Invalid mod name')
        }

        const mod = new Mod(json.id, json.name)

        if (typeof json.author === 'string') {
            mod.author = json.author
        }

        if (typeof json.version === 'string') {
            mod.version = json.version
        }

        return mod
    }
}
