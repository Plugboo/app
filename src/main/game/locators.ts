import { HoYoPlay } from "@main/util/hoyoverse/play";

/**
 * Namespace containing common game installation locators.
 */
export namespace InstallationLocators
{
    export const HOYOPLAY = (biz: string) =>
    {
        const installations = HoYoPlay.getGameInstallations();
        const foundInstallation = installations.find((i) => i.path !== null && i.biz === biz);
        return foundInstallation.path ?? null;
    };
}
