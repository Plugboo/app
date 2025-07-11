import { OpenDialogOptions, OpenDialogReturnValue } from 'electron'
import { IpcChannel } from '@common/types/ipc'
import invokeIpc from '@renderer/api/ipc'

export async function getAppTitleBar() {
    return invokeIpc<string>(IpcChannel.App_TitleBar)
}

export async function pickFileDialog(options: OpenDialogOptions) {
    return invokeIpc<OpenDialogReturnValue>(IpcChannel.App_PickFile, options)
}
