import { GamePropertiesDTO } from "@common/dto/game";
import { IpcChannels } from "@common/ipc/channel";
import { CreateProfileDialog } from "@renderer/component/page/game/createprofiledialog";
import { ProfileCard } from "@renderer/component/page/game/profilecard";
import Button from "@renderer/component/ui/button";
import { invokeIpc } from "@renderer/ipc";
import { ResourcesUtil } from "@renderer/util/resources";
import { FolderSearch2, LoaderCircle, PackagePlus } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { match } from "ts-pattern";

enum Status
{
    INSTALLED,
    NOT_INSTALLED,
    VERIFYING
}

interface PageState
{
    game: GamePropertiesDTO;
}

export default function GameOverviewPage()
{
    const { state } = useLocation();
    const { game } = state as PageState;

    const [status, setStatus] = useState<Status>(Status.VERIFYING);
    const [profiles, setProfiles] = useState<IpcChannels["game.profile.list"]["return"]>([]);
    const [content, setContent] = useState<IpcChannels["game.content.get"]["return"]>(null);

    /**
     * Modals
     */
    const [createProfileOpen, setCreateProfileOpen] = useState<boolean>(false);

    /* ================================== */

    const onClickCreateProfile = () =>
    {
        setCreateProfileOpen(true);
    };

    const onClickLocate = () =>
    {
        setStatus(Status.VERIFYING);
        setTimeout(() =>
        {
            invokeIpc("game.installation.locate", { id: game.id }).then((result) =>
            {
                setStatus(result ? Status.INSTALLED : Status.NOT_INSTALLED);
            });
        }, 1000);
    };

    /* ================================== */

    const renderActionButton = (icon: ReactNode, label: string, onClick?: () => void, disabled = false) => (
        <Button onClick={onClick} disabled={disabled} className="flex gap-2">
            {icon}
            {label}
        </Button>
    );

    const renderStatusActionButton = () =>
        match(status)
            .with(Status.INSTALLED, () => renderActionButton(<PackagePlus />, "CREATE PROFILE", onClickCreateProfile))
            .with(Status.NOT_INSTALLED, () =>
                renderActionButton(<FolderSearch2 />, "LOCATE INSTALLATION", onClickLocate)
            )
            .with(Status.VERIFYING, () =>
                renderActionButton(<LoaderCircle className="animate-spin" />, "VERIFYING", undefined, true)
            )
            .otherwise(() => null);

    /* ================================== */

    useEffect(() =>
    {
        if (game === undefined)
        {
            return;
        }

        setStatus(Status.VERIFYING);
        invokeIpc("game.installation.verify", { id: game.id }).then((result) =>
        {
            setStatus(result ? Status.INSTALLED : Status.NOT_INSTALLED);
        });

        invokeIpc("game.profile.list", { gameId: game.id }).then(setProfiles);
        invokeIpc("game.content.get", { id: game.id }).then(setContent);
    }, [game]);

    /* ================================== */

    if (game === undefined)
    {
        return <p>Internal Error</p>;
    }

    return (
        <main className="relative min-h-screen">
            <CreateProfileDialog
                gameId={game.id}
                open={createProfileOpen}
                setOpen={setCreateProfileOpen}
                onCreate={(profile) =>
                {
                    setProfiles((prev) => [...prev, profile]);
                }}
                loaders={[
                    {
                        label: "Migoto",
                        value: "migoto"
                    }
                ]}
            />
            <div className="top-0 left-0 bottom-0 right-0 overflow-hidden absolute -z-1">
                <div className="relative w-full h-120">
                    <img
                        className="max-w-370 w-full h-full object-cover mx-auto"
                        src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                        alt={game.details.name}
                    />
                    <img
                        className="w-full h-full object-cover absolute top-0 left-0 -z-1 blur-sm"
                        src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                        alt={game.details.name}
                    />
                </div>
                <img
                    className="w-full h-full object-cover opacity-5 scale-125 blur-lg"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                    alt={game.details.name}
                />
            </div>
            <div className="w-full h-90 relative">
                <img
                    className="absolute bottom-10 left-10 max-w-70 max-h-70 drop-shadow-lg drop-shadow-black"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.logo)}
                    alt={game.details.name}
                />
            </div>
            <div className="px-6 pb-4 space-y-2 backdrop-blur-sm bg-background/70 border-t border-border overflow-hidden">
                <div className="flex gap-8 py-4">
                    {renderStatusActionButton()}

                    <div className="text-[15px] -space-y-0.5">
                        <p>LAST PLAYED</p>
                        <span className="font-light">None</span>
                    </div>

                    <div className="text-[15px] -space-y-0.5">
                        <p>PLAY TIME</p>
                        <span className="font-light">0 min</span>
                    </div>
                </div>
                <div className="flex gap-12">
                    <div className="w-full flex flex-col gap-4">
                        {profiles.map((profile) => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                    <div>
                        {content && (
                            <div className="flex flex-col gap-4">
                                <p className="text-lg font-medium">ACTIVE BANNERS</p>
                                {content.banners.map((banner) => (
                                    <div
                                        key={banner.imageUrl}
                                        className="h-50 p-3 aspect-video bg-background-900/70 border border-border drop-shadow-lg drop-shadow-black"
                                    >
                                        <img
                                            className="w-full h-full object-cover"
                                            src={banner.imageUrl}
                                            alt={banner.link}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
