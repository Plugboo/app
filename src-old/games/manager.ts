import HoYoverseGame, { HoYoverseGameId } from './hoyoverse'
import GameBananaService from '../services/gamebanana'
import path from 'node:path'
import fs from 'node:fs'
import { Game } from './game'
import ThreeDMigoto from '../loaders/3dmigoto'

export default class GameManager {
    public static pathsFile: string

    public static entries: Game[] = [
        new HoYoverseGame(
            HoYoverseGameId.GenshinImpact,
            [new GameBananaService('8552')],
            [new ThreeDMigoto('SilentNightSound', 'GI-Model-Importer', 'genshin_impact/3dmigoto.json')]
        ),
        new HoYoverseGame(
            HoYoverseGameId.HonkaiStarRail,
            [new GameBananaService('18366')],
            [new ThreeDMigoto('SilentNightSound', 'SR-Model-Importer', 'honkai_star_rail/3dmigoto.json')]
        ),
        new HoYoverseGame(
            HoYoverseGameId.ZenlessZoneZero,
            [new GameBananaService('19567')],
            [new ThreeDMigoto('leotorrez', 'ZZ-Model-Importer', 'zenless_zone_zero/3dmigoto.json')]
        )
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
}
