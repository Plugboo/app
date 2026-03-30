import { GameContentDTO, GamePropertiesDTO } from "@common/dto/game";
import { ProviderDTO } from "@common/dto/provider";

type Channel<TParams, TReturn> = {
    params: TParams;
    return: TReturn;
};

export type IpcChannels = {
    "game.list": Channel<{}, ReadonlyArray<Readonly<GamePropertiesDTO>>>;
    "game.get": Channel<{ id: string }, Readonly<GamePropertiesDTO>>;
    "game.installation.locate": Channel<{ id: string }, boolean>;
    "game.content.get": Channel<
        { id: string },
        Readonly<{
            banners: ReadonlyArray<Readonly<GameContentDTO.Banner>>;
            posts: ReadonlyArray<Readonly<GameContentDTO.Post>>;
            socialMedia: ReadonlyArray<Readonly<GameContentDTO.SocialMedia>>;
        } | null>
    >;
    "provider.list": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO>>>;
    "provider.searchMods": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO.ModDTO>>>;
};
