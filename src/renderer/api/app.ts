import { OpenDialogOptions } from 'electron'
import { IpcChannel } from '@common/ipc'

export async function getAppTitleBar() {
    return await window.electron.ipc.invoke(IpcChannel.App_TitleBar)
}

export async function pickFileDialog(options: OpenDialogOptions) {
    return await window.electron.ipc.invoke(IpcChannel.App_PickFile, options)
}
