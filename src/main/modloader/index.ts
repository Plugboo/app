export abstract class ModLoader
{
    public readonly id: string;

    /**
     * Retrieves a list of available versions.
     */
    public async getVersions(): Promise<ReadonlyArray<ModLoader.Version>>
    {
        throw new Error("Not implemented");
    }
}

export declare namespace ModLoader
{
    export interface File
    {
        name: string;
        url: string;
    }

    export interface Version
    {
        version: string;
        file: File;
        publishedAt: Date;
    }
}
