export namespace GameContentDTO {
    export interface Banner
    {
        imageUrl: string;
        link: string;
    }

    export interface Post
    {
        title: string;
        type: string;
        date: string;
        link: string;
    }

    export interface SocialMedia
    {
        iconUrl: string;
        link: string;
    }
}

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
        logo: string;
    }
}
