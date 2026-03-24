import { app, BrowserWindow } from "electron";
import { Nullable } from "@common/util/type";
import path from "node:path";

export class Application
{
    private readonly devMode: boolean;
    private mainWindow: Nullable<BrowserWindow>;

    public constructor()
    {
        this.devMode = MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined;
        this.mainWindow = null;

        app.on("window-all-closed", () =>
        {
            if (process.platform !== "darwin")
            {
                app.quit();
            }
        });

        app.on("activate", async () =>
        {
            if (BrowserWindow.getAllWindows().length === 0)
            {
                await this.createMainWindow();
            }
        });
    }

    /**
     * Initializes the application.
     */
    public async init()
    {
        await this.createMainWindow();
    }

    /**
     * Creates the main window if it does not already exist.
     */
    public async createMainWindow()
    {
        if (this.mainWindow !== null)
        {
            return;
        }

        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js")
            }
        });

        if (this.devMode)
        {
            await this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

            this.mainWindow.webContents.openDevTools();
        }
        else
        {
            await this.mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
        }
    }
}

export const application = new Application();
