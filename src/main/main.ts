import { application } from "@main/core/application";
import { app } from "electron";
import started from "electron-squirrel-startup";

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () =>
{
    if (started)
    {
        app.quit();
        return;
    }

    await application.init();
});
