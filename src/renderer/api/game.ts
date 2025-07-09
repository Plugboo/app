import { GameProfile } from '@common/games'
import { IpcChannel } from '@common/ipc'
import { NewsArticle } from '@common/news'

export async function getNewsFromAll(): Promise<NewsArticle[]> {
    return await window.electron.ipc.invoke(IpcChannel.Game_NewsAll) as NewsArticle[]
}


export async function listGames() {
    return await window.electron.ipc.invoke(IpcChannel.Game_List)
}

export async function verifyGame(gameId: string) {
    return (await window.electron.ipc.invoke(IpcChannel.Game_Verify, gameId)) as {
        success: boolean
        reason?: string
        path?: string
    }
}

export async function setupGame(gameId: string, path: string) {
    return await window.electron.ipc.invoke(IpcChannel.Game_Setup, gameId, path)
}

export async function getProfiles(gameId: string): Promise<GameProfile[]> {
    return JSON.parse((await window.electron.ipc.invoke(IpcChannel.Game_GetProfiles, gameId)) as string) as GameProfile[]
}

export async function getProfile(gameId: string): Promise<GameProfile | null> {
    return JSON.parse((await window.electron.ipc.invoke(IpcChannel.Game_GetProfile, gameId)) as string) as GameProfile | null
}