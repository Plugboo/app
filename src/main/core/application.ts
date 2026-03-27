import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { IpcChannels } from "@common/ipc/channel";
import { Nullable } from "@common/util/type";
import { ProfileManager } from "@main/profile/manager";
import { Providers } from "@main/provider/providers";
import { GameProperties } from "@main/game/properties";
import { GameDeveloper } from "@main/game/developer";
import { HoYoverseLauncherAPI } from "@main/util/hoyoverse/launcher";

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
                details: {
                    name: game.details.name
                },
                assets: {
                    icon: game.assets.icon,
                    grid: game.assets.grid,
                    hero: game.assets.hero,
                    logo: game.assets.logo
                }
            }));
        });

        Application.handleIpc("game.get", (args) =>
        {
            const game = GameProperties.entries().find((game) => game.id === args.id);
            return game !== undefined
                ? {
                      id: game.id,
                      details: {
                          name: game.details.name
                      },
                      assets: {
                          icon: game.assets.icon,
                          grid: game.assets.grid,
                          hero: game.assets.hero,
                          logo: game.assets.logo
                      }
                  }
                : null;
        });

        Application.handleIpc("game.content.get", async (args) =>
        {
            const game = GameProperties.entries().find((game) => game.id === args.id);

            if (game === undefined)
            {
                return null;
            }

            switch (game.details.developer)
            {
                case GameDeveloper.HOYOVERSE:
                {
                    const gamesResponse = await HoYoverseLauncherAPI.getGames();

                    if (gamesResponse.isErr())
                    {
                        return null;
                    }

                    const hoYoGame = gamesResponse.value.find((g) => g.displayName === game.details.name);

                    if (hoYoGame === undefined)
                    {
                        return null;
                    }

                    const contentResponse = await HoYoverseLauncherAPI.getContent(hoYoGame.id);

                    if (contentResponse.isErr())
                    {
                        return null;
                    }

                    const content = contentResponse.value;

                    return {
                        banners: content.banners.map((b) => ({
                            imageUrl: b.imageUrl,
                            link: b.link
                        })),
                        posts: content.posts.map((p) => ({
                            title: p.title,
                            type: p.type,
                            date: p.date,
                            link: p.link
                        })),
                        socialMedia: content.socialMedia.map((s) => ({
                            iconUrl: s.iconUrl,
                            link: s.link
                        }))
                    };
                }
                default:
                {
                    return null;
                }
            }
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
