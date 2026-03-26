export class GameProperties
{
    private static readonly ENTRIES: GameProperties[] = [];

    public static readonly STAR_RAIL = new GameProperties(
        "STAR_RAIL",
        "Honkai: Star Rail",
        "StarRail.exe",
        ["HoYoKProtect.sys", "mhypbase.dll", "StarRail_Data/"],
        {
            icon: "ec01a34f7fc3b03448cc52f2a89d52e8.png",
            grid: "14219e4acfc4c50d323a47c2a6994299.png",
            hero: "33a4e204a72d69ec3786ff1cd02e7a66.png"
        }
    );
    public static readonly ZENLESS_ZONE_ZERO = new GameProperties(
        "ZENLESS_ZONE_ZERO",
        "Zenless Zone Zero",
        "ZenlessZoneZero.exe",
        ["HoYoKProtect.sys", "mhypbase.dll", "ZenlessZoneZero_Data/"],
        {
            icon: "048617ceb68b40a45847078db347ba59.png",
            grid: "bf1e25110516b753b33dcc6d3266d71c.png",
            hero: "912c3958f7545cc891334c5f671c7555.png"
        }
    );

    public readonly id: string;
    public readonly name: string;
    public readonly executableFile: string;

    /**
     * Files that are required to be present in the game directory to be a valid installation of the game.
     */
    public readonly requiredFiles: ReadonlyArray<string>;
    public readonly assets: Readonly<GameProperties.Assets>;

    private constructor(
        id: string,
        name: string,
        executableFile: string,
        requiredFiles: string[],
        assets: GameProperties.Assets
    )
    {
        this.id = id;
        this.name = name;
        this.executableFile = executableFile;
        this.requiredFiles = requiredFiles;
        this.assets = assets;

        GameProperties.ENTRIES.push(this);
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
    export interface Assets
    {
        icon: string;
        grid: string;
        hero: string;
    }
}
