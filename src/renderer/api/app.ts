import { OpenDialogOptions } from "electron"

export async function getAppTitleBar() {
  return await window.electron.ipc.invoke('app::titleBar')
}

export async function pickFileDialog(options: OpenDialogOptions) {
  return await window.electron.ipc.invoke('app:pickFile', options)
}
