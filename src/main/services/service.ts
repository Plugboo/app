import { Mod, Id, SearchModsOptions, GetCommentsOptions, Comment, Category } from '@common/service'

export class BaseService {
    public async searchMods(options: SearchModsOptions): Promise<Mod[]> {
        return []
    }

    public async getMod(modId: Id): Promise<Mod | null> {
        return null
    }

    public async getModComments(modId: Id, options: GetCommentsOptions): Promise<Comment[]> {
        return []
    }

    public async getCategories(): Promise<Category[]> {
        return []
    }
}