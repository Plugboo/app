import { app } from "electron";
import started from "electron-squirrel-startup";
import { application } from "@main/core/application";

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
