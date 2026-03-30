import { GameContentDTO, GamePropertiesDTO } from "@common/dto/game";
import { ProfileDTO } from "@common/dto/profile";
import { ProviderDTO } from "@common/dto/provider";
import { Nullable } from "@common/util/type";

type Channel<TParams, TReturn> = {
    params: TParams;
    return: TReturn;
};

export type IpcChannels = {
    "game.list": Channel<{}, ReadonlyArray<Readonly<GamePropertiesDTO>>>;
    "game.get": Channel<{ id: string }, Nullable<Readonly<GamePropertiesDTO>>>;
    "game.installation.verify": Channel<{ id: string }, boolean>;
    "game.installation.locate": Channel<{ id: string }, boolean>;
    "game.content.get": Channel<
        { id: string },
        Readonly<{
            banners: ReadonlyArray<Readonly<GameContentDTO.Banner>>;
            posts: ReadonlyArray<Readonly<GameContentDTO.Post>>;
            socialMedia: ReadonlyArray<Readonly<GameContentDTO.SocialMedia>>;
        } | null>
    >;
    "game.profile.create": Channel<{ gameId: string; name: string; modLoaderId: string }, boolean>;
    "game.profile.list": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProfileDTO>>>;
    "provider.list": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO>>>;
    "provider.searchMods": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO.ModDTO>>>;
};
