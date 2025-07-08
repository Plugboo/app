import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel } from '@common/ipc'

const electron = {
    ipc: {
        invoke(channel: IpcChannel, ...args: unknown[]): Promise<unknown> {
            return ipcRenderer.invoke(channel, ...args)
        },
    }
}

contextBridge.exposeInMainWorld('electron', electron)

export type ElectronHandler = typeof electron
