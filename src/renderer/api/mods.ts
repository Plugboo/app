import { Category, Comment, GetCommentsOptions, Mod, SearchModsOptions } from '@common/service'
import { IpcChannel } from '@common/ipc'

export async function getModComments(gameId: string, modId: string, options: GetCommentsOptions): Promise<Comment[]> {
    return await window.electron.ipc.invoke(IpcChannel.Mods_GetComments, gameId, modId, options) as Comment[]
}

export async function getMod(gameId: string, modId: string): Promise<Mod> {
    return await window.electron.ipc.invoke(IpcChannel.Mods_GetMod, gameId, modId) as Mod
}

export async function searchMods(gameId: string, options: SearchModsOptions): Promise<Mod[]> {
    return await window.electron.ipc.invoke(IpcChannel.Mods_Search, gameId, options) as Mod[]
}

export async function getCategories(gameId: string): Promise<Category[]> {
    return await window.electron.ipc.invoke(IpcChannel.Mods_GetCategories, gameId) as Category[]
}