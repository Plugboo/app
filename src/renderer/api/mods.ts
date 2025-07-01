import { Comment, GetCommentsOptions, Mod, SearchModsOptions } from '@common/service'

export async function getModComments(gameId: string, modId: string, options: GetCommentsOptions): Promise<Comment[]> {
  return await window.electron.ipc.invoke('mods::comments', gameId, modId, options) as Comment[]
}

export async function getMod(gameId: string, modId: string): Promise<Mod> {
  return await window.electron.ipc.invoke('mods::get', gameId, modId) as Mod
}

export async function searchMods(gameId: string, options: SearchModsOptions): Promise<Mod[]> {
  return await window.electron.ipc.invoke('mods::search', gameId, options) as Mod[]
}