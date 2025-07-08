import { application } from '@main/app'
import { IpcEvent } from './ipc'
import { Id } from '@common/service'

export default class GameIpc {
    public static listGames() {
        return application.games.entries.map((v) => v.info)
    }

    public static getProfiles(event: IpcEvent) {
        if (event.args.length !== 1) {
            return []
        }

        const gameId: Id = event.args[0]
        return application.profiles.entries
            .entries()
            .filter(([_, profile]) => profile.gameId === gameId)
            .map(([_, profile]) => profile)
            .toArray()
    }

    public static getProfile(event: IpcEvent) {
        if (event.args.length !== 1) {
            return null
        }

        const profileId: Id = event.args[0]
        return application.profiles.entries
            .entries()
            .find(([_, profile]) => profile.id === profileId)[1]
    }

    public static verify(event: IpcEvent) {
        if (event.args.length !== 1) {
            return {
                success: false,
                reason: 'INVALID_GAME_ID'
            }
        }

        const gameId: Id = event.args[0]

        const game = application.games.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return {
                success: false,
                reason: 'GAME_NOT_FOUND'
            }
        }

        if (game.installPath === null) {
            return {
                success: false,
                reason: 'GAME_NOT_INITIALIZED',
                path: game.searchInstallation()
            }
        }

        return {
            success: true
        }
    }

    public static setup(event: IpcEvent) {
        if (event.args.length !== 2) {
            return {
                success: false,
                reason: 'INVALID_GAME_ID'
            }
        }

        const gameId: Id = event.args[0]
        const path: string = event.args[1]

        const game = application.games.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return {
                success: false,
                reason: 'GAME_NOT_FOUND'
            }
        }

        if (game.installPath !== null) {
            return {
                success: false,
                reason: 'GAME_ALREADY_INITIALIZED'
            }
        }

        if (!game.validatePath(path)) {
            return {
                success: false,
                reason: 'INVALID_PATH'
            }
        }

        game.installPath = path
        application.games.savePaths()

        return {
            success: true
        }
    }

    public static createProfile(event: IpcEvent) {
        if (event.args.length !== 4) {
            return false
        }

        const gameId: Id = event.args[0]
        const name: string = event.args[1]
        const loaderId: string = event.args[2]
        const loaderVersion: string = event.args[3]

        const game = application.games.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return false
        }

        const loader = game.loaders.find((v) => v.id === loaderId)
        if (loader === undefined) {
            return false
        }

        return application.profiles.createProfile(gameId as string, name, loader, loaderVersion)
    }

    public static deleteProfile() {}
}