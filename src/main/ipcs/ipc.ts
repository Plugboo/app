import { ipcMain, IpcMainInvokeEvent } from 'electron'

type IpcHandler = (event: IpcEvent) => void

export interface IpcEvent {
    event: IpcMainInvokeEvent
    args: any[]
}

export default class IpcManager {
    private static _handlers: Map<string, IpcHandler> = new Map()

    public static registerHandler(channel: string, handler: IpcHandler) {
        if (IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already registered: ${channel}`)
        }

        IpcManager._handlers.set(channel, handler)
        ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: any) => {
            handler({
                event,
                args: [...args]
            })
        })
    }

    public static removeHandler(channel: string) {
        if (!IpcManager._handlers.has(channel)) {
            throw new Error(`Channel already removed: ${channel}`)
        }

        IpcManager._handlers.delete(channel)
        ipcMain.removeHandler(channel)
    }
}