import { err, ok, Result } from "neverthrow";
import { safePromise } from "@common/util/promise";
import { URLUtils } from "@main/util/url";

namespace REST
{
    export const URL = "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api";
    export const LAUNCHER_ID = "VYTpXlbWo8";

    export interface BaseResponse<T>
    {
        data: T | null;
        message: string;
        retcode: number;
    }

    export namespace GetGames
    {
        export interface Game
        {
            id: string;
            biz: string;
            display: {
                name: string;
                background: {
                    url: string;
                };
                icon: {
                    url: string;
                };
                logo: {
                    url: string;
                };
            };
        }

        export type Response = BaseResponse<{
            games: Game[];
        }>;
    }

    export namespace GetContent
    {
        export interface Banner
        {
            image: {
                url: string;
                link: string;
            };
        }

        export interface Post
        {
            title: string;
            type: string;
            date: string;
            link: string;
        }

        export interface SocialMedia
        {
            icon: {
                url: string;
                link: string;
            };
        }

        export type Response = BaseResponse<{
            content: {
                banners: Banner[];
                posts: Post[];
                social_media_list: SocialMedia[];
            };
        }>;
    }
}

export abstract class HoYoverseLauncherAPI
{
    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Retrieves the list of games available, inside the launcher, from the HoYoverse API.
     */
    public static async getGames(): Promise<Result<HoYoverseLauncherAPI.Game[], unknown>>
    {
        const response = await HoYoverseLauncherAPI.internalFetch("getGames");

        if (response.isErr())
        {
            return err(response.error);
        }

        const json = await safePromise(response.value.json());

        if (json.isErr())
        {
            return err(json.error);
        }

        const root = json.value as REST.GetGames.Response;

        if (HoYoverseLauncherAPI.hasError(root) || root.data === null)
        {
            return err(new Error(root.message));
        }

        return ok(
            root.data.games.map((game) => ({
                id: game.id,
                biz: game.biz,
                displayName: game.display.name,
                backgroundUrl: game.display.background.url,
                iconUrl: game.display.icon.url,
                logoUrl: game.display.logo.url
            }))
        );
    }

    /**
     * Retrieves the content of the specified game from the HoYoverse API.
     */
    public static async getContent(gameId: string): Promise<Result<HoYoverseLauncherAPI.ContentResponse, unknown>>
    {
        const response = await HoYoverseLauncherAPI.internalFetch("getGameContent", { game_id: gameId });

        if (response.isErr())
        {
            return err(response.error);
        }

        const json = await safePromise(response.value.json());

        if (json.isErr())
        {
            return err(json.error);
        }

        const root = json.value as REST.GetContent.Response;

        if (HoYoverseLauncherAPI.hasError(root) || root.data === null)
        {
            return err(new Error(root.message));
        }

        const content = root.data.content;

        return ok({
            banners: content.banners.map((b) => ({
                imageUrl: b.image.url,
                link: b.image.link
            })),
            posts: content.posts.map((p) => ({
                title: p.title,
                type: p.type,
                date: p.date,
                link: p.link
            })),
            socialMedia: content.social_media_list.map((s) => ({
                iconUrl: s.icon.url,
                link: s.icon.link
            }))
        });
    }

    /**
     * Makes an internal HTTP request to the specified path with optional query parameters.
     *
     * @param path - The API endpoint path to fetch data from.
     * @param [params] - Optional query parameters to include in the request.
     */
    private static async internalFetch(
        path: string,
        params?: Record<string, string>
    ): Promise<Result<Response, unknown>>
    {
        const finalParams = URLUtils.createParams({
            launcher_id: REST.LAUNCHER_ID,
            language: "en-us",
            ...params
        });

        return safePromise(fetch(`${REST.URL}/${path}?${finalParams}`));
    }

    /**
     * Determines if the given response contains an error.
     *
     * @param data - The response object to check.
     */
    private static hasError(data: REST.BaseResponse<unknown>): boolean
    {
        return data.retcode !== 0;
    }
}

export declare namespace HoYoverseLauncherAPI
{
    export interface Game
    {
        id: string;
        biz: string;
        displayName: string;
        backgroundUrl: string;
        iconUrl: string;
        logoUrl: string;
    }

    export interface Banner
    {
        imageUrl: string;
        link: string;
    }

    export interface Post
    {
        title: string;
        type: string;
        date: string;
        link: string;
    }

    export interface SocialMedia
    {
        iconUrl: string;
        link: string;
    }

    export interface ContentResponse
    {
        banners: Banner[];
        posts: Post[];
        socialMedia: SocialMedia[];
    }
}
