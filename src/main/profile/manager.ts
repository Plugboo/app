import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { Nullable } from "@common/util/type";
import { Application } from "@main/core/application";
import { GameProperties } from "@main/game/properties";
import { Profile } from "@main/profile";
import { ProfileConfig } from "@main/profile/config";

export abstract class ProfileManager
{
    private static readonly ENTRIES: Profile[] = [];

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Creates a new profile.
     * @param game - The game associated with the profile.
     * @param name - The name of the profile.
     */
    public static create(game: GameProperties, name: string): Readonly<Profile>
    {
        const profile = new Profile(uuidv4().toString(), game, name);
        ProfileManager.ENTRIES.push(profile);
        return profile;
    }

    /**
     * Deletes a profile by its ID.
     */
    public static delete(id: string)
    {
        const profile = ProfileManager.get(id);

        if (profile !== null)
        {
            profile.delete();
            ProfileManager.ENTRIES.splice(ProfileManager.ENTRIES.indexOf(profile), 1);
        }
    }

    /**
     * Loads profiles from the disk.
     */
    public static load()
    {
        const diskPath = ProfileManager.getPath();

        if (!fs.existsSync(diskPath))
        {
            fs.mkdirSync(diskPath, { recursive: true });
            return;
        }

        const files = fs.readdirSync(diskPath, { withFileTypes: true });

        for (const file of files)
        {
            if (!file.isDirectory())
            {
                continue;
            }

            const profilePath = path.join(diskPath, file.name);
            const configPath = path.join(profilePath, "profile.json");

            if (!fs.existsSync(configPath))
            {
                continue;
            }

            try
            {
                const content = fs.readFileSync(configPath, "utf-8");
                const data = JSON.parse(content);
                const version = data.version;

                if (typeof version !== "number" || !ProfileConfig.SUPPORTED_VERSIONS.includes(version))
                {
                    continue;
                }

                const configResult = ProfileConfig.parse(data, version);

                if (configResult.isErr())
                {
                    console.error(configResult.error);
                    continue;
                }

                const config = configResult.value;
                const properties = GameProperties.entries().find((game) => game.id === config.game);

                if (properties === undefined)
                {
                    console.error(`Unsupported game: ${config.game}`);
                    continue;
                }

                const profile = new Profile(file.name, properties, config.name);
                ProfileManager.ENTRIES.push(profile);
            }
            catch (e)
            {
                console.error(`Failed to read profile JSON file: ${e}`);
            }
        }
    }

    /**
     * Retrieves a profile by its ID.
     */
    public static get(id: string): Nullable<Profile>
    {
        return ProfileManager.ENTRIES.find((entry) => entry.id === id) ?? null;
    }

    /**
     * Retrieves all profiles.
     */
    public static get entries(): Readonly<Profile>[]
    {
        return ProfileManager.ENTRIES;
    }

    /**
     * Retrieves the path to the profiles directory.
     */
    public static getPath = () => path.join(Application.getAppDataPath(), "Profiles");
}
