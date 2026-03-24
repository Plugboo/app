import { GameBananaProvider } from "@main/provider/gamebanana";

export abstract class Providers
{
    public static readonly GAME_BANANA = new GameBananaProvider();

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {}
}
