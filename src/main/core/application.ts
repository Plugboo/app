import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { IpcChannels } from "@common/ipc/channel";
import { Nullable } from "@common/util/type";
import { ProfileManager } from "@main/profile/manager";
import { Providers } from "@main/provider/providers";
import { GameProperties } from "@main/game/properties";

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
        Application.handleIpc("game.list", () =>
        {
            return GameProperties.entries().map((game) => ({
                id: game.id,
                name: game.name,
                executableFile: game.executableFile,
                requiredFiles: game.requiredFiles
            }));
        });

        Application.handleIpc("provider.list", (args) =>
        {
            return Providers.entries()
                .filter((v) => v.supportedGames.find((g) => g.id === args.gameId) !== undefined)
                .map((p) => ({
                    id: p.id,
                    name: p.name
                }));
        });

        Application.handleIpc("provider.searchMods", async (args) =>
        {
            const provider = Providers.entries().find(
                (v) => v.supportedGames.find((g) => g.id === args.gameId) !== undefined
            );

            if (provider === undefined)
            {
                return [];
            }

            const response = await provider.searchMods(args.gameId);
            return response.mods.map((m) => ({
                id: m.id,
                name: m.name,
                likeCount: m.likeCount,
                viewCount: m.viewCount,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt
            }));
        });

        ProfileManager.load();

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

    /**
     * Retrieves the application data path.
     */
    public static getAppDataPath = (): string => path.resolve(app.getPath("appData"), app.getName());

    /**
     * Handles an IPC channel.
     */
    private static handleIpc<C extends keyof IpcChannels>(
        channel: C,
        callback: (args: IpcChannels[C]["params"]) => IpcChannels[C]["return"] | Promise<IpcChannels[C]["return"]>
    )
    {
        ipcMain.handle(channel, async (_, args) =>
        {
            return callback(args);
        });
    }
}

export const application = new Application();
