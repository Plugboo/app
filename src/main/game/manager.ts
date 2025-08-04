import { Game } from './index'
import HoYoverseGame, { HoYoverseGameId } from './hoyoverse'
import { Profile } from './profile'

export default class GameManager {
    private readonly games: Game[]

    constructor() {
        this.games = [
            new HoYoverseGame(HoYoverseGameId.GenshinImpact),
            new HoYoverseGame(HoYoverseGameId.HonkaiStarRail),
            new HoYoverseGame(HoYoverseGameId.ZenlessZoneZero)
        ]
    }

    /**
     * Retrieves a game by its unique identifier.
     *
     * @param id - The unique identifier of the game to retrieve.
     * @return The game object matching the provided identifier, or null if no match is found.
     */
    public getGame(id: string): Game | null {
        return this.games.find((v) => v.info.id === id) ?? null
    }

    /**
     * Retrieves a profile by its identifier.
     *
     * @param id - The unique identifier of the profile to retrieve.
     * @return The profile with the given identifier if found, otherwise null.
     */
    public getProfile(id: string): Profile | null {
        for (const game of this.games) {
            const profile = game.profiles.find((v) => v.id === id)
            if (profile !== undefined) {
                return profile
            }
        }
        return null
    }

    /**
     * Retrieves the list of games.
     */
    public getGames(): Game[] {
        return this.games
    }
}
