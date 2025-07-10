export namespace Github {
    export interface Release {
        url: string
        id: number
        node_id: string
        tag_name: string
        target_commitish: string
        name: string
        draft: boolean
        immutable: boolean
        prerelease: boolean
        created_at: string
        published_at: string
        assets: Asset[]
        tarball_url: string
        zipball_url: string
        body: string
        mentions_count: number
    }

    export interface Asset {
        url: string
        id: number
        node_id: string
        name: string
        label: any
        content_type: string
        state: string
        size: number
        digest: any
        download_count: number
        created_at: string
        updated_at: string
        browser_download_url: string
    }
}