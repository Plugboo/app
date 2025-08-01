import { IpcChannel } from '../../preload/types/ipc'

export async function minimizeWindow() {
    await window.electron.ipc.invoke(IpcChannel.Window_Minimize)
}

export async function maximizeWindow() {
    await window.electron.ipc.invoke(IpcChannel.Window_Maximize)
}

export async function closeWindow() {
    await window.electron.ipc.invoke(IpcChannel.Window_Close)
}
