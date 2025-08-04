import invokeIpc from '@renderer/api/ipc'

export async function minimizeWindow() {
    await invokeIpc('window/minimize')
}

export async function maximizeWindow() {
    await invokeIpc('window/maximize')
}

export async function closeWindow() {
    await invokeIpc('window/close')
}
