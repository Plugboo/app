import { app } from 'electron'
import started from 'electron-squirrel-startup'
import { application } from './app'

if (started) {
    app.quit()
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', async () => {
    await application.init()
})
