import { Category, Comment, GetCommentsOptions, Mod, SearchModsOptions } from '@common/types/service'
import { IpcChannel } from '@common/types/ipc'
import invokeIpc from '@renderer/api/ipc'

export async function getModComments(gameId: string, modId: string, options: GetCommentsOptions): Promise<Comment[]> {
    return invokeIpc<Comment[]>(IpcChannel.Mods_GetComments, gameId, modId, "gamebanana", options)
}

export async function getMod(gameId: string, modId: string): Promise<Mod | null> {
    return invokeIpc<Mod | null>(IpcChannel.Mods_GetMod, gameId, modId, "gamebanana")
}

export async function searchMods(gameId: string, options: SearchModsOptions): Promise<Mod[]> {
    return invokeIpc<Mod[]>(IpcChannel.Mods_Search, gameId, "gamebanana", options)
}

export async function getCategories(gameId: string): Promise<Category[]> {
    return invokeIpc<Category[]>(IpcChannel.Mods_GetCategories, gameId, "gamebanana")
}