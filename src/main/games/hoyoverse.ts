import { Game } from '@main/games/game'
import { GameInformation } from '@common/types/game'
import { BaseService } from '@main/services/service'
import { Loader } from '@common/types/loader'
import { NewsArticle } from '@common/types/news'
import HoYoPlay from '@main/utils/hoyoplay'
import { multiExists } from '@main/utils/filesystem'

interface HoYoLabArticle {
    post: {
        post_id: string
        subject: string
        content: string
        created_at: number
    },
    user: {
        uid: string
        nickname: string
    },
    cover_list: {
        url: string
        width: number
        height: number
    }[]
}

export enum HoYoverseGameId {
    GenshinImpact = 'genshin_impact',
    HonkaiStarRail = 'honkai_star_rail',
    ZenlessZoneZero = 'zenless_zone_zero'
}

export default class HoYoverseGame extends Game {
    private readonly gameId: HoYoverseGameId

    constructor(gameId: HoYoverseGameId, services: BaseService[], loaders: Loader[]) {
        let info: GameInformation

        switch (gameId) {
            case HoYoverseGameId.GenshinImpact:
                info = {
                    id: 'genshin_impact',
                    name: 'Genshin Impact',
                    banner: 'https://cdn2.steamgriddb.com/thumb/2d273973a88b3ab45f0d0763300b0695.jpg',
                    icon: 'https://cdn2.steamgriddb.com/icon_thumb/54795ec619ebda94c86d00184861c96f.png',
                    developer: 'HoYoverse'
                }
                break
            case HoYoverseGameId.HonkaiStarRail:
                info = {
                    id: 'honkai_star_rail',
                    name: 'Honkai: Star Rail',
                    banner: 'https://cdn2.steamgriddb.com/thumb/7de88187918ddefb552555ae0a7fc9b6.jpg',
                    icon: 'https://cdn2.steamgriddb.com/icon_thumb/e52da5a31de788599378924f0e639557.png',
                    developer: 'HoYoverse'
                }
                break
            case HoYoverseGameId.ZenlessZoneZero:
                info = {
                    id: 'zenless_zone_zero',
                    name: 'Zenless Zone Zero',
                    banner: 'https://cdn2.steamgriddb.com/thumb/97657e12f1b8cbf71b6837f02b23d423.jpg',
                    icon: 'https://cdn2.steamgriddb.com/icon_thumb/7029a498c4f596f73b35504df9bab02a.png',
                    developer: 'HoYoverse'
                }
                break
        }

        super(info, services, loaders)
        this.gameId = gameId
    }

    public validatePath(path: string): boolean {
        switch (this.gameId) {
            case HoYoverseGameId.GenshinImpact:
                return HoYoverseGame.validateGenshinImpactPath(path)
            case HoYoverseGameId.HonkaiStarRail:
                return HoYoverseGame.validateHonkaiStarRailPath(path)
            case HoYoverseGameId.ZenlessZoneZero:
                return HoYoverseGame.validateZenlessZoneZeroPath(path)
            default:
                return false
        }
    }

    public searchInstallation(): string {
        let exeName: string

        switch (this.gameId) {
            case HoYoverseGameId.GenshinImpact:
                exeName = 'GenshinImpact.exe'
                break
            case HoYoverseGameId.HonkaiStarRail:
                exeName = 'StarRail.exe'
                break
            case HoYoverseGameId.ZenlessZoneZero:
                exeName = 'ZenlessZoneZero.exe'
                break
        }

        return HoYoverseGame.searchHoyoPlayInstallation(exeName)
    }

    public async getNews(): Promise<NewsArticle[]> {
        let id: number
        let officialAccId: string

        switch (this.gameId) {
            case HoYoverseGameId.GenshinImpact:
                id = 2
                officialAccId = '1015537'
                break
            case HoYoverseGameId.HonkaiStarRail:
                id = 6
                officialAccId = '172534910'
                break
            case HoYoverseGameId.ZenlessZoneZero:
                id = 8
                officialAccId = '219270333'
                break
        }

        if (HoYoverseGame._cachedHoYoLabArticles.has(id)) {
            return HoYoverseGame._cachedHoYoLabArticles.get(id)
        }

        console.log("[HoYoverseGame] Fetching news for game:", this.gameId)

        const start = performance.now()
        const result = await HoYoverseGame.getHoYoLabArticles(id, officialAccId)

        console.log("[HoYoverseGame] Received", result.length, "valid articles in", (performance.now() - start).toFixed(2), "ms!")
        return result
    }

    private static _cachedHoYoLabArticles: Map<number, NewsArticle[]> = new Map()

    /**
     * Fetches HoYoLab articles for a specific game ID and filters articles by an official account ID.
     *
     * @param id - The unique game ID to fetch articles for.
     * @param officialAccId - The ID of the official account used to filter the articles.
     * @return A promise that resolves to an array of filtered NewsArticle objects.
     */
    private static async getHoYoLabArticles(id: number, officialAccId: string): Promise<NewsArticle[]> {
        const url = `https://bbs-api-os.hoyolab.com/community/post/wapi/getNewsList?gids=${id}&last_id=0&page_size=15&type=3`

        try {
            const response = await fetch(url)
            const json = await response.json()
            const articles: NewsArticle[] = []

            for (const hoyoArticle of (json.data.list as HoYoLabArticle[])) {
                if (hoyoArticle.user.uid !== officialAccId) {
                    continue
                }

                articles.push({
                    id: hoyoArticle.post.post_id,
                    title: hoyoArticle.post.subject,
                    createdAt: hoyoArticle.post.created_at,
                    coverUrl: hoyoArticle.cover_list.length > 0 ? hoyoArticle.cover_list[0].url : '',
                    content: hoyoArticle.post.content
                })
            }

            HoYoverseGame._cachedHoYoLabArticles.set(id, articles)
            return articles
        } catch (exception) {
            console.error('[HoYoverseGame] Exception occurred while trying to get HoYoLab articles: ', exception)
            return []
        }
    }

    /**
     * Searches for a HoyoPlay installation based on the provided executable name and returns the installation path
     * if available and valid.
     *
     * @param exeName - The name of the executable file associated with the HoyoPlay installation.
     * @return The installation path of the HoyoPlay game if found and valid, or an empty string otherwise.
     */
    private static searchHoyoPlayInstallation(exeName: string): string {
        const hoyoInstallation = HoYoPlay.getInstallations().find(
            (install) => install.gameInstallStatus.gameExeName === exeName
        )

        if (hoyoInstallation === undefined) {
            return ''
        }

        if (hoyoInstallation.installPath.length === 0) {
            return ''
        }

        if (hoyoInstallation.downloading) {
            return ''
        }

        return hoyoInstallation.installPath
    }

    private static validateGenshinImpactPath(installPath: string): boolean {
        return multiExists(installPath, ['GenshinImpact.exe', 'HoYoKProtect.sys', 'mhypbase.dll', 'GenshinImpact_Data/'])
    }

    private static validateHonkaiStarRailPath(installPath: string): boolean {
        return multiExists(installPath, ['StarRail.exe', 'HoYoKProtect.sys', 'mhypbase.dll', 'StarRail_Data/'])
    }

    private static validateZenlessZoneZeroPath(installPath: string): boolean {
        return multiExists(installPath, [
            'ZenlessZoneZero.exe',
            'HoYoKProtect.sys',
            'mhypbase.dll',
            'ZenlessZoneZero_Data/'
        ])
    }
}