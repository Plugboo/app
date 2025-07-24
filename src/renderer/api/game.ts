import { IpcChannel } from '@common/types/ipc'
import { NewsArticle } from '@common/types/news'
import { LoaderRData } from '@common/types/loader'
import invokeIpc from '@renderer/api/ipc'
import { GameInformation } from '@common/types/game'
import { ProfileRData } from '@common/types/profile'

export async function getNewsFromAll(): Promise<NewsArticle[]> {
    return invokeIpc<NewsArticle[]>(IpcChannel.Game_NewsAll)
}

export async function listGames() {
    return invokeIpc<GameInformation[]>(IpcChannel.Game_List)
}

export async function verifyGame(gameId: string) {
    return invokeIpc<{
        success: boolean
        reason?: string
        path?: string
    }>(IpcChannel.Game_Verify, gameId)
}

export async function setupGame(gameId: string, path: string) {
    return invokeIpc<{
        success: boolean
        reason?: string
    }>(IpcChannel.Game_Setup, gameId, path)
}

export async function getProfiles(gameId: string): Promise<ProfileRData[]> {
    return invokeIpc<ProfileRData[]>(IpcChannel.Game_GetProfiles, gameId)
}

export async function getProfile(profileId: string): Promise<ProfileRData | null> {
    return invokeIpc<ProfileRData | null>(IpcChannel.Game_GetProfile, profileId)
}

export async function createProfile(
    gameId: string,
    name: string,
    loaderId: string,
    loaderVersion: string
): Promise<boolean> {
    return invokeIpc<boolean>(IpcChannel.Game_CreateProfile, gameId, name, loaderId, loaderVersion)
}

export async function startProfile(profileId: string) {
    await invokeIpc<void>(IpcChannel.Game_StartProfile, profileId)
}

export async function getLoaders(gameId: string): Promise<LoaderRData[]> {
    return invokeIpc<LoaderRData[]>(IpcChannel.Game_Loaders, gameId)
}
