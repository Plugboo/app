import { safePromise } from "@common/util/promise";

export class GitHub
{
    /**
     * Fetches the list of releases for a given GitHub repository.
     *
     * @param owner - The owner of the GitHub repository.
     * @param repo - The name of the GitHub repository.
     */
    public static async getReleases(owner: string, repo: string): Promise<GitHub.Release[]>
    {
        const result = await safePromise(fetch(`https://api.github.com/repos/${owner}/${repo}/releases`));

        if (result.isErr())
        {
            return [];
        }

        const json = await safePromise(result.value.json());

        if (json.isErr())
        {
            return [];
        }

        const data = json.value;

        if (!Array.isArray(data))
        {
            return [];
        }

        return data;
    }
}

export declare namespace GitHub
{
    export interface Release
    {
        url: string;
        id: number;
        node_id: string;
        tag_name: string;
        target_commitish: string;
        name: string;
        draft: boolean;
        immutable: boolean;
        prerelease: boolean;
        created_at: string;
        published_at: string;
        assets: Asset[];
        tarball_url: string;
        zipball_url: string;
        body: string;
        mentions_count: number;
    }

    export interface Asset
    {
        url: string;
        id: number;
        node_id: string;
        name: string;
        label: any;
        content_type: string;
        state: string;
        size: number;
        digest: any;
        download_count: number;
        created_at: string;
        updated_at: string;
        browser_download_url: string;
    }

    export interface Location
    {
        owner: string;
        repo: string;
    }
}
