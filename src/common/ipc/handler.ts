import { IpcChannels } from "@common/ipc/channel";
import { contextBridge, ipcRenderer } from "electron";

const ipc = {
    async invoke<C extends keyof IpcChannels>(
        channel: C,
        args: IpcChannels[C]["params"]
    ): Promise<IpcChannels[C]["return"]>
    {
        return ipcRenderer.invoke(channel, args);
    }
};

contextBridge.exposeInMainWorld("ipc", ipc);

export type IpcHandler = typeof ipc;
