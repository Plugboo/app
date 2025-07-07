export async function minimizeWindow() {
    return await window.electron.ipc.invoke('window::minimize')
}

export async function maximizeWindow() {
    return await window.electron.ipc.invoke('window::maximize')
}

export async function closeWindow() {
    return await window.electron.ipc.invoke('window::close')
}
