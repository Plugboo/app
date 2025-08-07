import { contextBridge, ipcRenderer } from 'electron'

const electron = {
    ipc: {
        invoke(channel: string, ...args: unknown[]): Promise<unknown> {
            return ipcRenderer.invoke(channel, ...args)
        }
    }
}

contextBridge.exposeInMainWorld('electron', electron)

export type ElectronHandler = typeof electron
