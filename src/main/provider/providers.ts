import { GameBananaProvider } from "@main/provider/gamebanana";
import { Provider } from ".";

export abstract class Providers
{
    private static readonly ENTRIES: Provider[] = [];

    public static readonly GAME_BANANA = Providers.register(new GameBananaProvider());

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}

    /**
     * Retrieves all providers.
     */
    public static entries(): Readonly<Provider>[]
    {
        return Providers.ENTRIES;
    }

    /**
     * Registers a new provider.
     */
    private static register<T extends Provider>(provider: T)
    {
        Providers.ENTRIES.push(provider);
        return provider;
    }
}
