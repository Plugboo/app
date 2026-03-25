import { ProviderDTO } from "@common/dto/provider";

type Channel<TParams, TReturn> = {
    params: TParams;
    return: TReturn;
};

export type IpcChannels = {
    listProviders: Channel<{ gameId: string }, ReadonlyArray<Readonly<ProviderDTO>>>;
};
