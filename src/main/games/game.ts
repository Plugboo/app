import { GameInformation } from '@common/games'
import { BaseService } from '@main/services/service'
import { NewsArticle } from '@common/news'
import { Loader } from '@common/loader'

export class Game {
    public readonly info: GameInformation

    public services: BaseService[]

    public loaders: Loader[]

    public installPath: string | null

    constructor(info: GameInformation, services: BaseService[], loaders: Loader[]) {
        this.info = info
        this.services = services
        this.loaders = loaders
        this.installPath = null
    }

    /**
     * Searches for an installation and returns the result.
     *
     * @return The result of the installation search.
     */
    public searchInstallation(): string {
        return ''
    }

    /**
     * Fetches and returns a list of news articles.
     *
     * @return A promise that resolves to an array of news articles.
     */
    public async getNews(): Promise<NewsArticle[]> {
        return []
    }

    /**
     * Validates the given directory path.
     *
     * @param path - The directory path to validate.
     * @return Returns true if the path is valid, otherwise false.
     */
    public validatePath(path: string): boolean {
        return false
    }
}
