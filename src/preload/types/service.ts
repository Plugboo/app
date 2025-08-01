export type Id = string | number

export interface Mod {
    id: Id
    name: string
    version: string
    media: Media[]
    createdAt: Date
    updatedAt: Date
    likes: number
    comments: number
    views: number
    author: Author
    tags: string[]
    content?: string
    nsfw: boolean
}

export interface Author {
    id: Id
    name: string
    avatarUrl: string
}

export interface Media {
    url: string
}

export interface Comment {
    id: Id
    createdAt: Date
    updatedAt: Date
    replyCount: number
    content: string
    author: Author | null
}

export interface Category {
    id: Id
    name: string
    itemCount: number
    iconUrl: string
}

export interface SearchModsOptions {
    page?: number
    limit?: number
    query?: string
    sort?: 'new' | 'default' | 'updated'
}

export interface SearchModsResponse {
    mods: Mod[]
    totalCount: number
}

export interface GetCommentsOptions {
    page?: number
}
