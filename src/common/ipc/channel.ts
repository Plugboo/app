import { ProviderDTO } from "@common/dto/provider";

type Channel<TParams, TReturn> = {
    params: TParams;
    return: TReturn;
};

export type IpcChannels = {
    "provider.list": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO>>>;
    "provider.searchMods": Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO.ModDTO>>>;
};
