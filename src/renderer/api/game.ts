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
    return invokeIpc<GameInformation[]>('game/list')
}

export async function verifyGame(gameId: string) {
    return invokeIpc<{
        success: boolean
        reason?: string
        path?: string
    }>('game/verify', gameId)
}

export async function setupGame(gameId: string, path: string) {
    return invokeIpc<{
        success: boolean
        reason?: string
    }>('game/setup', gameId, path)
}

export async function getProfiles(gameId: string): Promise<ProfileRData[]> {
    return invokeIpc<ProfileRData[]>('game/profiles', gameId)
}

export async function getProfile(profileId: string): Promise<ProfileRData | null> {
    return invokeIpc<ProfileRData | null>('game/profiles/get', profileId)
}

export async function createProfile(
    gameId: string,
    name: string,
    loaderId: string,
    loaderVersion: string
): Promise<{
    success: boolean
    reason?: string
}> {
    return invokeIpc<{
        success: boolean
        reason?: string
    }>('game/profiles/create', gameId, name, loaderId, loaderVersion)
}

export async function startProfile(profileId: string) {
    await invokeIpc<void>('game/profiles/start', profileId)
}

export async function installMod(profileId: string, serviceId: Id, modId: Id) {
    await invokeIpc<void>('game/profiles/mods/install', profileId, serviceId, modId)
}

export async function getLoaders(gameId: string): Promise<LoaderRData[]> {
    return invokeIpc<LoaderRData[]>('game/loaders', gameId)
}
