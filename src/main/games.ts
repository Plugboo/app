import { GameInformation } from '@common/games'
import fs from 'node:fs'
import path from 'node:path'
import HoyoPlay from './utils/hoyoplay'
import { multiExists } from './utils/filesystem'
import GameBananaService from '@main/services/gamebanana'
import { BaseService } from '@main/services/service'
import { Loader } from '@main/loader'

export interface Game {
    info: GameInformation
    installPath: string | null
    validatePath: (installPath: string) => boolean
    searchInstallation: () => string
    services: BaseService[]
    loaders: Loader[]
}

export default class GameManager {
    public static pathsFile: string

    public static entries: Game[] = [
        {
            info: {
                id: 'genshin_impact',
                name: 'Genshin Impact',
                banner: 'https://images.gamebanana.com/img/banners/games/63388a097a525.jpg?opt=w300',
                icon: 'https://cdn2.steamgriddb.com/icon_thumb/54795ec619ebda94c86d00184861c96f.png',
                developer: 'miHoYo'
            },
            installPath: null,
            validatePath: (installPath: string) => {
                return GameManager.validateGenshinImpactPath(installPath)
            },
            searchInstallation: () => {
                return GameManager.searchHoyoPlayInstallation('GenshinImpact.exe')
            },
            services: [
                new GameBananaService('8552')
            ],
            loaders: []
        },
        {
            info: {
                id: 'honkai_star_rail',
                name: 'Honkai: Star Rail',
                banner: 'https://images.gamebanana.com/img/banners/games/64ccf63a5ceb7.png?opt=w300',
                icon: 'https://cdn2.steamgriddb.com/icon_thumb/e52da5a31de788599378924f0e639557.png',
                developer: 'miHoYo'
            },
            installPath: null,
            validatePath: (installPath: string) => {
                return GameManager.validateHonkaiStarRailPath(installPath)
            },
            searchInstallation: () => {
                return GameManager.searchHoyoPlayInstallation('StarRail.exe')
            },
            services: [
                new GameBananaService('18366')
            ],
            loaders: []
        },
        {
            info: {
                id: 'zenless_zone_zero',
                name: 'Zenless Zone Zero',
                banner: 'https://optimg.gamebanana.com/img/banners/games/66868cbc731d2.jpg?opt=w300',
                icon: 'https://cdn2.steamgriddb.com/icon_thumb/7029a498c4f596f73b35504df9bab02a.png',
                developer: 'miHoYo'
            },
            installPath: null,
            validatePath: (installPath: string) => {
                return GameManager.validateZenlessZoneZeroPath(installPath)
            },
            searchInstallation: () => {
                return GameManager.searchHoyoPlayInstallation('ZenlessZoneZero.exe')
            },
            services: [
                new GameBananaService('19567')
            ],
            loaders: []
        }
    ]

    public static loadPaths() {
        try {
            const directoryPath = path.join(GameManager.pathsFile, '..')

            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
            }

            if (!fs.existsSync(GameManager.pathsFile)) {
                console.log('GamesManager::loadPaths(): Creating paths file..')
                GameManager.savePaths()
            }

            const data = fs.readFileSync(GameManager.pathsFile, {
                encoding: 'utf8'
            })
            const paths = GameManager.serializePaths(JSON.parse(data))

            for (const pair of paths) {
                const game = GameManager.entries.find((v) => v.info.id === pair[0])
                if (game !== undefined) {
                    if (game.validatePath(pair[1])) {
                        game.installPath = pair[1]
                    } else {
                        console.error('GamesManager::loadPaths(): Received invalid path for game: ', game.info.id)
                    }
                }
            }

            return true
        } catch (error) {
            console.error('GamesManager::loadPaths(): Exception occurred while loading paths: ', error)
            return false
        }
    }

    public static savePaths() {
        try {
            const data: any = {}
            for (const game of GameManager.entries) {
                data[game.info.id] = game.installPath
            }

            fs.writeFileSync(GameManager.pathsFile, JSON.stringify(data, null, 2), {
                encoding: 'utf8'
            })
        } catch (error) {
            console.error('GamesManager::savePaths(): Exception occurred while saving paths: ', error)
            return false
        }
    }

    private static serializePaths(data: any): Map<string, string> {
        if (Array.isArray(data)) {
            return new Map()
        }

        const paths = new Map<string, string>()

        for (const game of GameManager.entries) {
            const gameId = game.info.id

            if (typeof data[game.info.id] === 'string') {
                paths.set(game.info.id, data[gameId])
            }
        }

        return paths
    }

    private static searchHoyoPlayInstallation(exeName: string): string {
        const hoyoInstallation = HoyoPlay.getInstallations().find(
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
