import fs from "node:fs";
import path from "node:path";
import { GameProperties } from "@main/game/properties";
import { ProfileManager } from "@main/profile/manager";
import { ProfileConfig } from "@main/profile/config";

export class Profile
{
    public readonly id: string;
    public readonly gameId: string;
    public name: string;

    public constructor(id: string, game: GameProperties, name: string)
    {
        this.id = id;
        this.gameId = game.id;
        this.name = name;
    }

    /**
     * Saves the profile to the disk.
     */
    public save()
    {
        const diskPath = this.getPath();

        if (!fs.existsSync(diskPath))
        {
            fs.mkdirSync(diskPath, { recursive: true });
        }

        const modsPath = path.join(diskPath, "mods");

        if (!fs.existsSync(modsPath))
        {
            fs.mkdirSync(modsPath);
        }

        const profilePath = path.join(diskPath, "profile.json");
        fs.writeFileSync(profilePath, JSON.stringify(ProfileConfig.create(this, ProfileConfig.NEWEST_VERSION), null, 4));
    }

    /**
     * Deletes the profile from the disk.
     */
    public delete()
    {
        const diskPath = this.getPath();

        if (fs.existsSync(diskPath))
        {
            fs.rmSync(diskPath, {
                recursive: true,
                force: true
            });
        }
    }

    /**
     * Retrieves the path to the profile directory.
     */
    public getPath = () => path.join(ProfileManager.getPath(), this.id);
}
