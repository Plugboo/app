export default async function invokeIpc<T>(channel: string, ...args: any): Promise<T> {
    const response: any = await window.electron.ipc.invoke('ipc-handler', channel, ...args)
    if (typeof response === 'string' && response.includes('___IS_OBJECT')) {
        return JSON.parse(response as string).data as T
    }
    return response as T
}
