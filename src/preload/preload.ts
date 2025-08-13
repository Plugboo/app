import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const electron = {
    ipc: {
        invoke(channel: string, ...args: unknown[]): Promise<unknown> {
            return ipcRenderer.invoke(channel, ...args)
        },
        on(channel: string, func: (...args: unknown[]) => void) {
            const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args)
            ipcRenderer.on(channel, subscription)

            return () => {
                ipcRenderer.removeListener(channel, subscription)
            }
        }
    }
}

contextBridge.exposeInMainWorld('electron', electron)

export type ElectronHandler = typeof electron
