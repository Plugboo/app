import { GameInformation } from '@preload/types/game'
import { Profile } from './profile'

export class Game {
    public readonly info: GameInformation

    public installPath: string | null

    public profiles: Profile[]

    constructor(info: GameInformation) {
        this.info = info
        this.installPath = null
        this.profiles = []
    }

    /**
     * Searches for an installation and returns the result.
     *
     * @return The result of the installation search.
     */
    public searchInstallation(): string | null {
        throw new Error('Game::searchInstallation() not implemented')
    }

    /**
     * Validates the given directory path.
     *
     * @param path - The directory path to validate.
     * @return Returns true if the path is valid, otherwise false.
     */
    public validatePath(path: string): boolean {
        throw new Error('Game::validatePath() not implemented')
    }
}
