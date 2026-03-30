import { Provider } from "./index";
import { safePromise } from "@common/util/promise";
import { GameProperties } from "@main/game/properties";
import { URLUtils } from "@main/util/url";

namespace REST
{
    export const URL: string = "https://gamebanana.com/apiv11";

    export interface BaseResponse
    {
        _sErrorCode?: string;
    }

    export namespace Subfeed
    {
        export interface Image
        {
            _sType: string;
            _sBaseUrl: string;
            _sFile: string;
        }

        export interface PreviewMedia
        {
            _aImages?: Image[];
        }

        export interface Record
        {
            _idRow: number;
            _sModelName: string;
            _sIconClasses: string;
            _sName: string;
            _tsDateAdded: number;
            _tsDateModified: number;
            _aPreviewMedia: PreviewMedia;
            _bHasFiles: boolean;
            _nLikeCount: number;
            _nViewCount: number;
        }

        export interface Metadata
        {
            _nRecordCount: number;
            _nPerpage: number;
        }

        export interface Response extends BaseResponse
        {
            _aMetadata: Metadata;
            _aRecords: Record[];
        }
    }
}

namespace Internal
{
    export const EMPTY_SEARCH_RESPONSE: Provider.SearchResponse = {
        mods: [],
        totalCount: 0
    };
}

export class GameBananaProvider extends Provider
{
    private static readonly SUPPORTED_GAMES = [
        {
            restId: 18366,
            properties: GameProperties.STAR_RAIL
        },
        {
            restId: 19567,
            properties: GameProperties.ZENLESS_ZONE_ZERO
        }
    ];

    public constructor()
    {
        super(
            "GAME_BANANA",
            "GameBanana",
            GameBananaProvider.SUPPORTED_GAMES.map((game) => game.properties)
        );
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
        const game = GameBananaProvider.SUPPORTED_GAMES.find((game) => game.properties.id === id);

        if (game === undefined)
        {
            return Internal.EMPTY_SEARCH_RESPONSE;
        }

        const page = options.page ?? 1;
        const perPage = options.perPage ?? 15;

        const params = URLUtils.createParams({
            _csvModelInclusions: "Mod",
            _nPage: page.toString(),
            _nPerPage: perPage.toString(),
            _sName: options.query ?? undefined
        });

        const httpResponse = await safePromise(fetch(`${REST.URL}/Game/${game.restId}/Subfeed?${params}`));

        if (httpResponse.isErr())
        {
            return Internal.EMPTY_SEARCH_RESPONSE;
        }

        const json = await safePromise(httpResponse.value.json());

        if (json.isErr())
        {
            return Internal.EMPTY_SEARCH_RESPONSE;
        }

        const data = json.value as REST.Subfeed.Response;

        if (data._sErrorCode !== undefined)
        {
            return Internal.EMPTY_SEARCH_RESPONSE;
        }

        return {
            mods: data._aRecords.map((record) => ({
                id: record._idRow.toString(),
                name: record._sName,
                likeCount: record._nLikeCount,
                viewCount: record._nViewCount,
                createdAt: new Date(record._tsDateAdded * 1000),
                updatedAt: new Date(record._tsDateModified * 1000)
            })),
            totalCount: data._aMetadata._nRecordCount
        };
    }
}
