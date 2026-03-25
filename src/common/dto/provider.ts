export interface ProviderDTO
{
    id: string;
    name: string;
}

export declare namespace ProviderDTO
{
    export interface ModDTO
    {
        id: string;
        name: string;
        likeCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }
}
