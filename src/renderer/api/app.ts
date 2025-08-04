import { OpenDialogOptions, OpenDialogReturnValue } from 'electron'
import { IpcChannel } from '@preload/types/ipc'
import invokeIpc from '@renderer/api/ipc'

export async function getAppTitleBar() {
    return 'custom'
}

export async function pickFileDialog(options: OpenDialogOptions) {
    return invokeIpc<OpenDialogReturnValue>(IpcChannel.App_PickFile, options)
}
