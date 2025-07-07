import ConfigManager from '@main/config'
import { dialog, OpenDialogOptions } from 'electron'
import { IpcEvent } from '@main/ipcs/ipc'

export default class AppIpc {
    public static getTitleBarConfig() {
        return ConfigManager.config.titleBar
    }

    public static async showFileDialog(event: IpcEvent) {
        if (event.args.length === 0) {
            return null
        }

        const options: OpenDialogOptions = event.args[0]
        return await dialog.showOpenDialog(options)
    }
}