import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { IpcChannel } from '@common/ipc'

type IpcHandler = (event: IpcEvent) => void

export interface IpcEvent {
    event: IpcMainInvokeEvent
    args: any[]
}

export default class IpcManager {
    private static _handlers: Map<string, IpcHandler> = new Map()

    public static registerHandler(channel: IpcChannel, handler: IpcHandler) {
        if (IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already registered: ${channel}`)
        }

        console.log(`[IpcManager] Registering handler for channel: ${channel}`)
        IpcManager._handlers.set(channel, handler)
        ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: any) => {
            return handler({
                event,
                args: [...args]
            })
        })
    }

    public static removeHandler(channel: IpcChannel) {
        if (!IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already removed: ${channel}`)
        }

        console.log(`[IpcManager] Removing handler for channel: ${channel}`)
        IpcManager._handlers.delete(channel)
        ipcMain.removeHandler(channel)
    }
}