import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { IpcChannel } from '@common/ipc'

type IpcHandler = (event: IpcEvent) => Promise<unknown>

export interface IpcEvent {
    event: IpcMainInvokeEvent
    args: any[]
}

export default class IpcManager {
    private static _handlers: Map<string, IpcHandler> = new Map()

    /**
     * Registers a handler for a specific IPC channel. Throws an error if the channel is already registered.
     *
     * @param channel - The IPC channel to associate with the handler.
     * @param handler - The function that will be invoked when the specified channel receives a request.
     */
    public static registerHandler(channel: IpcChannel, handler: IpcHandler) {
        if (IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already registered: ${channel}`)
        }

        console.log(`[IpcManager] Registering handler for channel: ${channel}`)
        IpcManager._handlers.set(channel, handler)
        ipcMain.handle(channel, async (event: IpcMainInvokeEvent, ...args: any) => {
            console.log(`[IpcManager] Received invoke in channel: ${channel}`)
            const start = performance.now()
            const result = await handler({
                event,
                args: [...args]
            })
            console.log("[IpcManager] Handled invoke in channel:", channel, "in", (performance.now() - start).toFixed(2), "ms!")
            return result
        })
    }

    /**
     * Removes the handler for the specified IPC channel. Throws an error if the channel is not registered.
     *
     * @param channel - The IPC channel whose handler should be removed.
     */
    public static removeHandler(channel: IpcChannel) {
        if (!IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already removed: ${channel}`)
        }

        console.log(`[IpcManager] Removing handler for channel: ${channel}`)
        IpcManager._handlers.delete(channel)
        ipcMain.removeHandler(channel)
    }
}