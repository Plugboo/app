export async function listGames() {
  return await window.electron.ipc.invoke('game::list')
}

export async function selectGame(gameId: string) {
  return await window.electron.ipc.invoke('game::select', gameId)
}

export async function setupGame(gameId: string, path: string) {
  return await window.electron.ipc.invoke('game::setup', gameId, path)
}
