import { Nullable } from "@common/util/type";
import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

namespace Internal
{
    export const GAMEDATA_INSTALLATIONS_REGEX =
        /{"download_transaction_no"((.*?)("wpf_pkg_version_dir":)(.+?(?=}})..))/gm;

    export namespace GameData
    {
        export interface Installation
        {
            gameBiz: string;
            gameShortcutName: string;
            installPath: string;
            downloading: boolean;
            packageName: string;
        }
    }
}

export abstract class HoYoPlay
{
    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Retrieves the list of installed HoYoverse game installations.
     */
    public static getGameInstallations(): HoYoPlay.GameInstallation[]
    {
        const dataPath = path.join(app.getPath("appData"), "Cognosphere/HYP/1_0/data/gamedata.dat");

        if (!fs.existsSync(dataPath))
        {
            return [];
        }

        const data = fs.readFileSync(dataPath, "utf-8");
        const installations: HoYoPlay.GameInstallation[] = [];

        for (const match of data.matchAll(Internal.GAMEDATA_INSTALLATIONS_REGEX))
        {
            const raw = match[0];
            const installation = JSON.parse(raw) as Internal.GameData.Installation;

            const normalizedInstallPath = installation.installPath.length > 0 ? installation.installPath : null;
            const alreadyExists = installations.some(
                (existingInstallation) =>
                    existingInstallation.biz === installation.gameBiz &&
                    existingInstallation.edition === installation.packageName &&
                    existingInstallation.path === normalizedInstallPath
            );

            if (alreadyExists)
            {
                continue;
            }

            installations.push({
                biz: installation.gameBiz,
                name: installation.gameShortcutName,
                downloading: installation.downloading,
                path: installation.installPath.length > 0 ? installation.installPath : null,
                edition: installation.packageName
            });
        }

        return installations;
    }
}

export declare namespace HoYoPlay
{
    export interface GameInstallation
    {
        biz: string;
        name: string;
        downloading: boolean;
        path: Nullable<string>;
        edition: string;
    }
}
