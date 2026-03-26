export interface GamePropertiesDTO
{
    id: string;
    details: Readonly<GamePropertiesDTO.DetailsDTO>;
    assets: Readonly<GamePropertiesDTO.AssetsDTO>;
}

export declare namespace GamePropertiesDTO
{
    export interface DetailsDTO
    {
        name: string;
    }

    export interface AssetsDTO
    {
        icon: string;
        grid: string;
        hero: string;
    }
}
