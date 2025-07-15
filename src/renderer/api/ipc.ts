import { IpcChannel } from '@common/types/ipc'

export default async function invokeIpc<T>(channel: IpcChannel, ...args: any): Promise<T> {
    const response: any = await window.electron.ipc.invoke(channel, ...args)
    if (typeof response === 'string' && response.includes('___ipc_obj__yes_yes_yes')) {
        return JSON.parse(response as string).data as T
    }
    return response as T
}
