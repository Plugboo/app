export namespace GitHub {
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

    /**
     * Fetches the list of releases for a given GitHub repository.
     *
     * @param owner - The owner of the GitHub repository.
     * @param repo - The name of the GitHub repository.
     * @return A promise that resolves to an array of release objects.
     */
    export async function getReleases(owner: string, repo: string): Promise<Release[]> {
        return await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`).then((res) => res.json())
    }
}
