import { GameProfile } from '@common/games'

export async function listGames() {
  return await window.electron.ipc.invoke('game::list')
}

export async function verifyGame(gameId: string) {
  return (await window.electron.ipc.invoke('game::verifyGame', gameId)) as {
    success: boolean
    reason?: string
    path?: string
  }
}

export async function setupGame(gameId: string, path: string) {
  return await window.electron.ipc.invoke('game::setup', gameId, path)
}

export async function getProfiles(gameId: string): Promise<GameProfile[]> {
  return JSON.parse((await window.electron.ipc.invoke('game::profiles', gameId)) as string) as GameProfile[]
}

export async function getProfile(gameId: string): Promise<GameProfile | null> {
  return JSON.parse((await window.electron.ipc.invoke('game::profile', gameId)) as string) as GameProfile | null
}