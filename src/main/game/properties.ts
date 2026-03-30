import { GameDeveloper } from "@main/game/developer";
import { HoYoPlay } from "@main/util/hoyoverse/play";
import { Nullable } from "@common/util/type";
import path from "node:path";
import fs from "node:fs";

export class GameProperties
{
    private static readonly ENTRIES: GameProperties[] = [];

    public static readonly STAR_RAIL = new GameProperties({
        id: "STAR_RAIL",
        details: {
            name: "Honkai Star Rail",
            developer: GameDeveloper.HOYOVERSE
        },
        installation: {
            executableFile: "StarRail.exe",
            requiredFiles: ["HoYoKProtect.sys", "mhypbase.dll", "StarRail_Data/"],
            locators: [
                () =>
                {
                    const installations = HoYoPlay.getGameInstallations();
                    const foundInstallation = installations.find((i) => i.path !== null && i.biz === "hkrpg_global");
                    return foundInstallation.path ?? null;
                }
            ]
        },
        assets: {
            icon: "ec01a34f7fc3b03448cc52f2a89d52e8.png",
            grid: "14219e4acfc4c50d323a47c2a6994299.png",
            hero: "33a4e204a72d69ec3786ff1cd02e7a66.png",
            logo: "804bfd285116c91c935176b2b199894d.png"
        }
    });
    
    public static readonly ZENLESS_ZONE_ZERO = new GameProperties({
        id: "ZENLESS_ZONE_ZERO",
        details: {
            name: "Zenless Zone Zero",
            developer: GameDeveloper.HOYOVERSE
        },
        installation: {
            executableFile: "ZenlessZoneZero.exe",
            requiredFiles: ["HoYoKProtect.sys", "mhypbase.dll", "ZenlessZoneZero_Data/"],
            locators: [
                () =>
                {
                    const installations = HoYoPlay.getGameInstallations();
                    const foundInstallation = installations.find((i) => i.path !== null && i.biz === "nap_global");
                    return foundInstallation.path ?? null;
                }
            ]
        },
        assets: {
            icon: "048617ceb68b40a45847078db347ba59.png",
            grid: "bf1e25110516b753b33dcc6d3266d71c.png",
            hero: "912c3958f7545cc891334c5f671c7555.png",
            logo: "6636876050dcade8ec8e3023b1afe9bc.png"
        }
    });

    public readonly id: string;
    public readonly details: Readonly<GameProperties.Details>;
    public readonly installation: Readonly<GameProperties.Installation>;
    public readonly assets: Readonly<GameProperties.Assets>;

    private constructor(data: {
        id: string;
        details: GameProperties.Details;
        installation: GameProperties.Installation;
        assets: GameProperties.Assets;
    })
    {
        this.id = data.id;
        this.details = data.details;
        this.installation = data.installation;
        this.assets = data.assets;

        GameProperties.ENTRIES.push(this);
    }

    /**
     * Locates the installation of the game.
     */
    public locateInstallation()
    {
        const requiredFiles = [...this.installation.requiredFiles, this.installation.executableFile];

        return (
            this.installation.locators
                .map((locator) => locator())
                .filter(Boolean)
                .find((installationPath) =>
                    requiredFiles.every((file) => fs.existsSync(path.join(installationPath, file)))
                ) ?? null
        );
    }

    /**
     * Retrieves all moddable games.
     */
    public static entries(): Readonly<GameProperties>[]
    {
        return GameProperties.ENTRIES;
    }
}

export declare namespace GameProperties
{
    export interface Details
    {
        name: string;
        developer: GameDeveloper;
    }

    export type InstallationLocator = () => Nullable<string>;

    export interface Installation
    {
        executableFile: string;
        requiredFiles: ReadonlyArray<string>;
        locators: ReadonlyArray<InstallationLocator>;
    }

    export interface Assets
    {
        icon: string;
        grid: string;
        hero: string;
        logo: string;
    }
}
