import { Category, Comment, GetCommentsOptions, Id, Mod, SearchModsOptions } from '@common/types/service'
import { BaseService } from '@main/services/service'

interface ModInfo {
    _idRow: number
    _nStatus: string
    _bIsPrivate: boolean
    _tsDateModified: number
    _tsDateAdded: number
    _sProfileUrl: string
    _aPreviewMedia: PreviewMedia
    _sCommentsMode: string
    _bAccessorIsSubmitter: boolean
    _bIsTrashed: boolean
    _bIsWithheld: boolean
    _sName: string
    _nUpdatesCount: number
    _bHasUpdates: boolean
    _nAllTodosCount: number
    _bHasTodos: boolean
    _nPostCount: number
    _aTags: any[]
    _bCreatedBySubmitter: boolean
    _bIsPorted: boolean
    _nThanksCount: number
    _aContentRatings: ContentRatings
    _sInitialVisibility: string
    _sDownloadUrl: string
    _nDownloadCount: number
    _aFiles: File[]
    _nSubscriberCount: number
    _aContributingStudios: any[]
    _bGenerateTableOfContents: boolean
    _sText: string
    _bIsObsolete: boolean
    _nLikeCount: number
    _nViewCount: number
    _sVersion: string
    _bAcceptsDonations: boolean
    _bShowRipePromo: boolean
    _aSubmitter: Submitter
    _bFollowLinks: boolean
    _aGame?: Game
    _aCategory: ModCategory
    _aSuperCategory: SuperCategory
    _aCredits: Credit[]
}

interface Record {
    _idRow: number
    _sModelName: string
    _sSingularTitle: string
    _sIconClasses: string
    _sName: string
    _sProfileUrl: string
    _tsDateAdded: number
    _tsDateModified: number
    _bHasFiles: boolean
    _aTags: any[]
    _aPreviewMedia: PreviewMedia
    _aSubmitter: Submitter
    _aRootCategory: RootCategory
    _sVersion?: string
    _tsDateUpdated?: number
    _bIsObsolete?: boolean
    _sInitialVisibility: string
    _bHasContentRatings: boolean
    _nLikeCount?: number
    _nPostCount?: number
    _nViewCount?: number
    _bWasFeatured: boolean
    _bIsOwnedByAccessor: boolean
    _akDevelopmentState?: string
    _sDevelopmentState?: string
    _iCompletionPercentage?: number
    _bIsStuck?: boolean
    _akState?: string
    _sState?: string
}

interface PreviewMedia {
    _aImages: Image[]
}

interface Image {
    _sType: string
    _sBaseUrl: string
    _sFile: string
    _sFile220?: string
    _hFile220?: number
    _wFile220?: number
    _sFile530?: string
    _hFile530?: number
    _wFile530?: number
    _sFile100?: string
    _hFile100?: number
    _wFile100?: number
    _sFile800?: string
    _hFile800?: number
    _wFile800?: number
}

interface Submitter {
    _idRow: number
    _sName: string
    _sUserTitle: string
    _sHonoraryTitle: string
    _tsJoinDate: number
    _sAvatarUrl: string
    _sSigUrl: string
    _sProfileUrl: string
    _sPointsUrl: string
    _sMedalsUrl: string
    _bIsOnline: boolean
    _sLocation: string
    _sOnlineTitle: string
    _sOfflineTitle: string
    _nPoints: number
    _nPointsRank: number
    _aNormalMedals: [string, string, string, number][]
    _aRareMedals: [string, string, string, number][]
    _aLegendaryMedals: [string, string, string, number][]
    _bHasRipe: boolean
    _nBuddyCount: number
    _nSubscriberCount: number
    _bAccessorIsBuddy: boolean
    _bBuddyRequestExistsWithAccessor: boolean
    _bAccessorIsSubscribed: boolean
    _sHdAvatarUrl: string
}

interface ContentRatings {
    sa: string
}

interface Game {
    _idRow: number
}

interface File {
    _idRow: number
    _sFile: string
    _nFilesize: number
    _tsDateAdded: number
    _nDownloadCount: number
    _sDownloadUrl: string
    _sMd5Checksum: string
    _sAnalysisState: string
    _sAnalysisResult: string
    _sAnalysisResultVerbose: string
    _sAvastAvState: string
    _sAvastAvResult: string
    _bHasContents: boolean
}

interface ModCategory {
    _idRow: number
    _sName: string
    _sModelName: string
    _sProfileUrl: string
    _sIconUrl: string
}

interface SuperCategory {
    _idRow: number
    _sName: string
    _sModelName: string
    _sProfileUrl: string
    _sIconUrl: string
}

interface Credit {
    _sGroupName: string
    _aAuthors: Author[]
}

interface Author {
    _idRow: number
    _sName: string
    _sProfileUrl: string
    _bIsOnline: boolean
}

interface RootCategory {
    _sName: string
    _sProfileUrl: string
    _sIconUrl: string
}

interface Metadata {
    _nRecordCount: number
    _nPerpage: number
    _bIsComplete: boolean
}

interface ModSearchRoot {
    _aMetadata: Metadata
    _aRecords: Record[]
}

interface CommentInfo {
    _idRow: number
    _nStatus: string
    _tsDateAdded: number
    _tsDateModified: number
    _nReplyCount: number
    _iPinLevel: number
    _nStampScore: number
    _aPreviewMedia: any[]
    _sText: string
    _aPoster?: Poster
    _bFollowLinks: boolean
    _aStamps: Stamp[]
}

interface Poster {
    _idRow: number
    _sName: string
    _bIsOnline: boolean
    _bHasRipe: boolean
    _sProfileUrl: string
    _sAvatarUrl: string
    _tsJoinDate: number
    _sUserTitle: string
    _sHonoraryTitle: string
    _sSigUrl: string
}

interface Stamp {
    _sTitle: string
    _sIconClasses: string
    _sCategory: string
    _nCount: number
    _sUnlockName?: string
}

interface ModCommentsRoot {
    _aMetadata: Metadata
    _aRecords: CommentInfo[]
}

interface ProfilePageRoot {
    _aModRootCategories: ModRootCategory[]
}

interface ModRootCategory {
    _idRow: number
    _sName: string
    _nItemCount: number
    _sIconUrl: string
}

const BASE_URL: string = 'https://gamebanana.com/apiv11'

export default class GameBananaService extends BaseService {
    private readonly _gameId: string

    constructor(gameId: string) {
        super()
        this._gameId = gameId
    }

    public async searchMods(options: SearchModsOptions): Promise<Mod[]> {
        const page = options.page ?? 1
        const query = options.query ?? ''
        const sort = options.sort ?? 'default'

        /*
         * Allow searching for a specific mod by its id
         */
        {
            const directModNumber = parseInt(query, 10)
            if (!isNaN(directModNumber) && directModNumber >= 0) {
                const response = await this.getMod(query)
                return response ? [response] : []
            }
        }

        try {
            const url = `${BASE_URL}/Game/${this._gameId}/Subfeed?_sSort=${sort}&_csvModelInclusions=Mod&_nPage=${page}${query ? `&_sName=${query}` : ''}`
            const response = await fetch(url)
            if (!response.ok) {
                return []
            }

            const data = await response.json()
            if (data._sErrorCode !== undefined) {
                return []
            }

            const root = data as ModSearchRoot
            return root._aRecords.map((record) => (
                {
                    id: record._idRow,
                    name: record._sName,
                    createdAt: new Date(record._tsDateAdded),
                    updatedAt: new Date(record._tsDateModified),
                    comments: record._nPostCount ?? 0,
                    likes: record._nLikeCount ?? 0,
                    views: record._nViewCount ?? 0,
                    version: record._sVersion ?? 'N/A',
                    media: record._aPreviewMedia._aImages.map((image) => (
                        {
                            url: `${image._sBaseUrl}/${image._sFile}`
                        }
                    )),
                    tags: [
                        record._aRootCategory._sName
                    ],
                    author: {
                        id: String(record._aSubmitter._idRow),
                        name: record._aSubmitter._sName,
                        avatarUrl: record._aSubmitter._sAvatarUrl
                    },
                    nsfw: record._bHasContentRatings
                }
            ))
        } catch (exception) {
            console.error('GameBananaService::searchMods(): Exception occurred while trying to search mods:', exception)
            return []
        }
    }

    public async getMod(modId: Id): Promise<Mod | null> {
        try {
            const url = `${BASE_URL}/Mod/${modId}/ProfilePage`
            const response = await fetch(url)
            if (!response.ok) {
                return null
            }

            const data = await response.json()
            const mod = data as ModInfo

            /*
             * Prevent getting mods from other games or no game.
             */
            if (mod._aGame === undefined || mod._aGame._idRow !== parseInt(this._gameId, 10)) {
                return null
            }

            return {
                id: mod._idRow,
                name: mod._sName,
                createdAt: new Date(mod._tsDateAdded),
                updatedAt: new Date(mod._tsDateModified),
                comments: mod._nPostCount ?? 0,
                likes: mod._nLikeCount ?? 0,
                views: mod._nViewCount ?? 0,
                version: mod._sVersion ?? 'N/A',
                media: mod._aPreviewMedia._aImages.map((image) => (
                    {
                        url: `${image._sBaseUrl}/${image._sFile}`
                    }
                )),
                tags: [
                    mod._aCategory._sName
                ],
                author: {
                    id: String(mod._aSubmitter._idRow),
                    name: mod._aSubmitter._sName,
                    avatarUrl: mod._aSubmitter._sAvatarUrl
                },
                content: mod._sText,
                nsfw: false
            }
        } catch (exception) {
            console.error('GameBananaService::getMod(): Exception occurred while trying to get a mod:', exception)
            return null
        }
    }

    public async getModComments(modId: Id, options: GetCommentsOptions): Promise<Comment[]> {
        const page = options.page ?? 1

        try {
            const url = `${BASE_URL}/Mod/${modId}/Posts?_nPage=${page}&_nPerPage=15&_sSort=popular`
            const response = await fetch(url)
            if (!response.ok) {
                return []
            }

            const data = await response.json()
            if (data._sErrorCode !== undefined) {
                return []
            }

            const root = data as ModCommentsRoot
            return root._aRecords.map((record) => (
                {
                    id: record._idRow,
                    content: record._sText,
                    createdAt: new Date(record._tsDateAdded),
                    updatedAt: new Date(record._tsDateModified),
                    replyCount: record._nReplyCount,
                    author: record._aPoster ? {
                        id: record._aPoster._idRow,
                        name: record._aPoster._sName,
                        avatarUrl: record._aPoster._sAvatarUrl
                    } : null
                }
            ))
        } catch (exception) {
            console.error('GameBananaService::getModComments(): Exception occurred while trying to get mod comments:', exception)
            return []
        }
    }

    public async getCategories(): Promise<Category[]> {
        try {
            const url = `${BASE_URL}/Game/${this._gameId}/ProfilePage`
            const response = await fetch(url)
            if (!response.ok) {
                return []
            }

            const data = await response.json()
            if (data._sErrorCode !== undefined) {
                return []
            }

            const root = data as ProfilePageRoot
            return root._aModRootCategories.map((category) => (
                {
                    id: category._idRow,
                    name: category._sName,
                    iconUrl: category._sIconUrl,
                    itemCount: category._nItemCount
                }
            ))
        } catch (exception) {
            console.error('GameBananaService::getCategories(): Exception occurred while trying to get categories:', exception)
            return []
        }
    }

    public getId(): string {
        return 'gamebanana'
    }
}