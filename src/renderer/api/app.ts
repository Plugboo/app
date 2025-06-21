export async function getAppTitleBar() {
  return await window.electron.ipc.invoke('app::titleBar')
}