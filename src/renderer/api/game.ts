import { GameProfile } from '@common/games'

export async function listGames() {
  return await window.electron.ipc.invoke('game::list')
}

export async function selectGame(gameId: string) {
  return (await window.electron.ipc.invoke('game::select', gameId)) as {
    success: boolean
    reason?: string
    path?: string
  }
}

export async function setupGame(gameId: string, path: string) {
  return await window.electron.ipc.invoke('game::setup', gameId, path)
}

export async function getProfiles(): Promise<GameProfile[]> {
  return JSON.parse((await window.electron.ipc.invoke('game::profiles')) as string) as GameProfile[]
}

export async function selectProfile(id: string): Promise<boolean> {
  return (await window.electron.ipc.invoke('game::selectProfile', id)) as boolean
}

export async function getCurrentProfile(): Promise<GameProfile | null> {
  return JSON.parse((await window.electron.ipc.invoke('game::currentProfile')) as string) as GameProfile | null
}
