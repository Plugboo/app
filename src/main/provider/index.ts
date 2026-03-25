import { GameProperties } from "@main/game/properties";

export class Provider
{
    public readonly id: string;
    public readonly name: string;
    public readonly supportedGames: ReadonlyArray<Readonly<GameProperties>>;

    protected constructor(id: string, name: string, supportedGames: GameProperties[])
    {
        this.id = id;
        this.name = name;
        this.supportedGames = supportedGames;
    }

    /**
     * Searches for mods based on the provided game ID and optional search options.
     *
     * @param {string} id - The identifier of the game whose mods are to be searched.
     * @param {Provider.SearchOptions} [options={}] - Optional search parameters.
     * @return {Promise<Provider.SearchResponse>} A Promise that resolves to the search response.
     */
    public async searchMods(id: string, options: Provider.SearchOptions = {}): Promise<Provider.SearchResponse>
    {
        throw new Error("Not implemented");
    }
}

export declare namespace Provider
{
    /* ========= STRUCTS  ========= */

    export interface Mod
    {
        id: string;
        name: string;
        likeCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }

    /* ========= RESPONSES  ========= */

    export type SearchResponse = Readonly<{
        mods: Readonly<Mod>[];
        totalCount: number;
    }>;

    /* ========= OPTIONS  ========= */

    export type SearchOptions = {
        query?: string;
        page?: number;
        perPage?: number;
    };
}
