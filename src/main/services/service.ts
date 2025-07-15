import { Category, Comment, GetCommentsOptions, Id, Mod, SearchModsOptions } from '@common/types/service'

export class BaseService {
    public async searchMods(options: SearchModsOptions): Promise<Mod[]> {
        throw new Error('Not implemented')
    }

    public async getMod(modId: Id): Promise<Mod | null> {
        throw new Error('Not implemented')
    }

    public async getModComments(modId: Id, options: GetCommentsOptions): Promise<Comment[]> {
        throw new Error('Not implemented')
    }

    public async getCategories(): Promise<Category[]> {
        throw new Error('Not implemented')
    }

    public getId(): string {
        throw new Error('Not implemented')
    }
}
