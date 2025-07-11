export default class RendererDataSerializer<T> {
    /**
     * Serializes data that is ready to be sent to the renderer process.
     *
     * @return The serialized data for the renderer process.
     */
    public serializeRendererData(): T {
        throw new Error('Not implemented')
    }
}