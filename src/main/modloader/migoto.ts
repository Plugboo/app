import { ModLoader } from "@main/modloader";
import { GitHub } from "@main/util/github";

namespace Internal
{
    export const ZIP_CONTENT_TYPES = ["application/zip", "application/x-zip-compressed"];
}

export class MigotoModLoader extends ModLoader
{
    private readonly coreLibraryLocation: GitHub.Location;
    private cacheTime: number;

    private versions: ModLoader.Version[];
    private coreLibraryVersions: ModLoader.Version[];

    public constructor(coreLibraryLocation: GitHub.Location)
    {
        super();

        this.coreLibraryLocation = coreLibraryLocation;
        this.cacheTime = 0;

        this.versions = [];
        this.coreLibraryVersions = [];
    }

    public async getVersions(): Promise<ReadonlyArray<ModLoader.Version>>
    {
        const now = Date.now();

        if (now - this.cacheTime < 1000 * 60 * 5)
        {
            this.versions = await this.getLoaderVersions();
            this.cacheTime = now;
        }

        return this.versions;
    }

    private async getLoaderVersions(): Promise<ModLoader.Version[]>
    {
        const releases = await GitHub.getReleases("SpectrumQT", "XXMI-Libs-Package");

        if (releases.length === 0)
        {
            return [];
        }

        return this.mapReleases(releases);
    }

    private async getCoreLibraryVersions(): Promise<ModLoader.Version[]>
    {
        const releases = await GitHub.getReleases(this.coreLibraryLocation.owner, this.coreLibraryLocation.repo);

        if (releases.length === 0)
        {
            return [];
        }

        return this.mapReleases(releases);
    }

    private async mapReleases(releases: GitHub.Release[]): Promise<ModLoader.Version[]>
    {
        return releases
            .filter((r) => !r.draft)
            .flatMap((r) =>
                r.assets.filter(MigotoModLoader.isZip).map((a) => ({
                    version: r.tag_name,
                    file: { name: a.name, url: a.browser_download_url },
                    publishedAt: new Date(r.published_at)
                }))
            );
    }

    private static isZip(asset: GitHub.Asset): boolean
    {
        return Internal.ZIP_CONTENT_TYPES.includes(asset.content_type) && !asset.name.endsWith(".json");
    }
}
