export interface GamePropertiesDTO
{
    id: string;
    name: string;
    executableFile: string;
    requiredFiles: ReadonlyArray<string>;
    assets: Readonly<GamePropertiesDTO.AssetsDTO>;
}

export declare namespace GamePropertiesDTO
{
    export interface AssetsDTO
    {
        icon: string;
        grid: string;
        hero: string;
    }
}
