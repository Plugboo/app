export class GameProperties
{
    private static readonly ENTRIES: GameProperties[] = [];

    public static readonly STAR_RAIL = new GameProperties("STAR_RAIL", "StarRail.exe", [
        "HoYoKProtect.sys",
        "mhypbase.dll",
        "StarRail_Data/"
    ]);
    public static readonly ZENLESS_ZONE_ZERO = new GameProperties("ZENLESS_ZONE_ZERO", "ZenlessZoneZero.exe", [
        "HoYoKProtect.sys",
        "mhypbase.dll",
        "ZenlessZoneZero_Data/"
    ]);

    public readonly id: string;
    public readonly executableFile: string;

    /**
     * Files that are required to be present in the game directory to be a valid installation of the game.
     */
    public readonly requiredFiles: ReadonlyArray<string>;

    private constructor(id: string, executableFile: string, requiredFiles: string[])
    {
        this.id = id;
        this.executableFile = executableFile;
        this.requiredFiles = requiredFiles;

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
