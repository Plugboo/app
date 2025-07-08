import { IpcChannel } from '@common/ipc'

export async function minimizeWindow() {
    return await window.electron.ipc.invoke(IpcChannel.Window_Minimize)
}

export async function maximizeWindow() {
    return await window.electron.ipc.invoke(IpcChannel.Window_Maximize)
}

export async function closeWindow() {
    return await window.electron.ipc.invoke(IpcChannel.Window_Close)
}
