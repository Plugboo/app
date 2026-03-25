import { IpcChannels } from "@common/ipc/channel";

/**
 * Invokes an IPC (Inter-Process Communication) channel with the specified arguments.
 *
 * @param channel - The name of the IPC channel to invoke.
 * @param args - The parameters to send with the IPC request.
 */
export async function invokeIpc<C extends keyof IpcChannels>(
    channel: C,
    args: IpcChannels[C]["params"]
): Promise<IpcChannels[C]["return"]>
{
    return await window.ipc.invoke(channel, args);
}
