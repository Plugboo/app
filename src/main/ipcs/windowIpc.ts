import { application } from '@main/app'

export default class WindowIpc {
    public static minimize() {
        application.window.minimize()
    }

    public static maximize() {
        if (application.window.isMaximized()) {
            application.window.unmaximize()
        } else {
            application.window.maximize()
        }
    }

    public static close() {
        application.window.close()
    }
}