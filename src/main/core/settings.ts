import { Nullable } from "@common/util/type";
import { Application } from "@main/core/application";
import { GameProperties } from "@main/game/properties";
import fs from "node:fs";
import path from "node:path";

export abstract class Settings
{
    public static data: Settings.Data = Settings.getDefaultState();

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Loads the settings from the file.
     */
    public static load()
    {
        const filePath = Settings.getFilePath();

        if (!fs.existsSync(filePath))
        {
            this.save(Settings.getDefaultState());
        }
        else
        {
            const content = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(content);

            /**
             * Try to parse the data, and if it fails, save the default state.
             */
            if (!Settings.parseData(data))
            {
                this.save(Settings.getDefaultState());
            }
            else
            {
                this.save();
            }
        }
    }

    /**
     * Saves the settings to the file.
     */
    public static save(data?: Settings.Data)
    {
        fs.writeFileSync(Settings.getFilePath(), JSON.stringify(data ?? Settings.data, null, 4));
    }

    /**
     * Parses the data and updates the settings.
     */
    private static parseData(data: any): boolean
    {
        const result: Settings.Data = Settings.getDefaultState();

        const data_games = data.games;

        if (typeof data_games !== "object" || data_games === null)
        {
            return false;
        }

        for (const key of Object.keys(data_games))
        {
            const value = data_games[key];

            if (typeof value !== "object" || value === null)
            {
                return false;
            }

            const installationPath = value.installation_path;

            if (typeof installationPath !== "string" && installationPath !== null)
            {
                return false;
            }

            result.games[key] = { installation_path: installationPath };
        }

        Settings.data = result;
        return true;
    }

    /**
     * Generates the default state for the settings.
     */
    private static getDefaultState(): Settings.Data
    {
        const data: Settings.Data = { games: {} };

        for (const game of GameProperties.entries())
        {
            data.games[game.id] = { installation_path: null };
        }

        return data;
    }

    /**
     * Retrieves the file path for the settings.
     */
    private static getFilePath(): string
    {
        return path.join(Application.getAppDataPath(), "settings.json");
    }
}

export declare namespace Settings
{
    export interface GameSettings
    {
        installation_path: Nullable<string>;
    }

    export interface Data
    {
        games: {
            [key: string]: GameSettings;
        };
    }
}
