import { IpcHandler } from "@common/ipc/handler";

declare global
{
    // eslint-disable-next-line no-unused-vars
    interface Window
    {
        ipc: IpcHandler;
    }
}

export {};
