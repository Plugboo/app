import { IpcEvent } from '@main/ipcs/ipc'
import { GetCommentsOptions, Id, SearchModsOptions } from '@common/types/service'
import GameManager from '@main/games/manager'

export default class ModIpc {
    public static async getMod(event: IpcEvent) {
        if (event.args.length !== 3) {
            return null
        }

        const gameId: Id = event.args[0]
        const modId: Id = event.args[1]
        const serviceId: Id = event.args[2]

        const game = GameManager.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return null
        }

        const service = game.services.find((v) => v.getId() === serviceId)
        if (service === undefined) {
            return null
        }

        return await service.getMod(modId)
    }

    public static async searchMods(event: IpcEvent) {
        if (event.args.length !== 3) {
            return null
        }

        const gameId: Id = event.args[0]
        const serviceId: Id = event.args[1]
        const options: SearchModsOptions = event.args[2]

        const game = GameManager.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return []
        }

        const service = game.services.find((v) => v.getId() === serviceId)
        if (service === undefined) {
            return []
        }

        return await service.searchMods(options)
    }

    public static async getComments(event: IpcEvent) {
        if (event.args.length !== 4) {
            return null
        }

        const gameId: Id = event.args[0]
        const modId: Id = event.args[1]
        const serviceId: Id = event.args[2]
        const options: GetCommentsOptions = event.args[3]

        const game = GameManager.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return []
        }

        const service = game.services.find((v) => v.getId() === serviceId)
        if (service === undefined) {
            return []
        }

        return await service.getModComments(modId, options)
    }

    public static async getCategories(event: IpcEvent) {
        if (event.args.length !== 2) {
            return null
        }

        const gameId: Id = event.args[0]
        const serviceId: Id = event.args[1]

        const game = GameManager.entries.find((v) => v.info.id === gameId)
        if (game === undefined) {
            return []
        }

        const service = game.services.find((v) => v.getId() === serviceId)
        if (service === undefined) {
            return []
        }

        return await service.getCategories()
    }
}