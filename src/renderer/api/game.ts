import { IpcChannel } from '@preload/types/ipc'
import { NewsArticle } from '@preload/types/news'
import { LoaderRData } from '@preload/types/loader'
import invokeIpc from '@renderer/api/ipc'
import { GameInformation } from '@preload/types/game'
import { ProfileRData } from '@preload/types/profile'
import { Id } from '@preload/types/service'

export async function getNewsFromAll(): Promise<NewsArticle[]> {
    return (await invokeIpc<NewsArticle[]>(IpcChannel.Game_NewsAll)) ?? []
}

export async function listGames() {
    return (await invokeIpc<GameInformation[]>(IpcChannel.Game_List)) ?? []
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

export async function installMod(profileId: string, serviceId: Id, modId: Id) {
    await invokeIpc<void>(IpcChannel.Game_ProfileInstallMod, profileId, serviceId, modId)
}

export async function getLoaders(gameId: string): Promise<LoaderRData[]> {
    return invokeIpc<LoaderRData[]>(IpcChannel.Game_Loaders, gameId)
}
