/**
 * Utility class for handling resources.
 */
export abstract class ResourcesUtil
{
    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Generates a file path for a game asset based on the provided game ID and file name.
     *
     * @param gameId The unique identifier of the game.
     * @param file The name of the file to link.
     */
    public static linkGameAsset(gameId: string, file: string): string
    {
        return `resources/game/${gameId.toLowerCase()}/${file}`;
    }
}
