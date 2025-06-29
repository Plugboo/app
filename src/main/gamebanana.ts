type Id = string | number

const BASE_URL: string = 'https://gamebanana.com/apiv11'

namespace GameBanana {
  export interface Mod {
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
    _aGame: Game
    _aCategory: Category
    _aSuperCategory: SuperCategory
    _aCredits: Credit[]
  }

  export interface PreviewMedia {
    _aImages: Image[]
  }

  export interface Image {
    _sType: string
    _sBaseUrl: string
    _sFile: string
    _sFile220?: string
    _hFile220?: number
    _wFile220?: number
    _sFile530?: string
    _hFile530?: number
    _wFile530?: number
    _sFile100: string
    _hFile100: number
    _wFile100: number
    _sFile800?: string
    _hFile800?: number
    _wFile800?: number
  }

  export interface ContentRatings {
    sa: string
  }

  export interface File {
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

  export interface Submitter {
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
    _aDonationMethods: DonationMethod[]
    _bAccessorIsBuddy: boolean
    _bBuddyRequestExistsWithAccessor: boolean
    _bAccessorIsSubscribed: boolean
    _aDefaultLicenseChecklist: DefaultLicenseChecklist
    _sHdAvatarUrl: string
  }

  export interface DonationMethod {
    _sTitle: string
    _sValue: string
    _sInputType: string
    _sInputPlaceholder: string
    _sIconClasses: string
    _aValidator: Validator
    _sValueTemplate: string
    _bIsUrl: boolean
    _sFormattedValue: string
  }

  export interface Validator {
    _regexValidPattern: string
    _sWarningMessage: string
  }

  export interface DefaultLicenseChecklist {
    '1': string
    '2': string
    '3': string
    '4': string
    '5': string
    '6': string
    '7': string
  }

  export interface Game {
    _idRow: number
    _sName: string
    _sAbbreviation: string
    _sProfileUrl: string
    _sIconUrl: string
    _sBannerUrl: string
    _nSubscriberCount: number
    _bHasSubmissionQueue: boolean
    _bAccessorIsSubscribed: boolean
  }

  export interface Category {
    _idRow: number
    _sName: string
    _sModelName: string
    _sProfileUrl: string
    _sIconUrl: string
  }

  export interface SuperCategory {
    _idRow: number
    _sName: string
    _sModelName: string
    _sProfileUrl: string
    _sIconUrl: string
  }

  export interface Credit {
    _sGroupName: string
    _aAuthors: Author[]
  }

  export interface Author {
    _idRow: number
    _sName: string
    _sProfileUrl: string
    _bIsOnline: boolean
  }

  export class Api {
    public static async getModPage(modId: Id): Promise<Mod | null> {
      try {
        const url = `${BASE_URL}/Mod/${modId}/ProfilePage`
        const response = await fetch(url)
        if (!response.ok) {
          return null
        }

        const data = await response.json()
        return data satisfies Mod
      } catch (exception) {
        console.error('GameBanana::getModPage(): Exception occurred while trying to get a mod:', exception)
        return
      }
    }
  }
}