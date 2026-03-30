import { GamePropertiesDTO } from "@common/dto/game";
import { ProfileDTO } from "@common/dto/profile";
import { ModCard } from "@renderer/component/page/game/modcard";
import Button from "@renderer/component/ui/button";
import { ResourcesUtil } from "@renderer/util/resources";
import { LoaderCircle, PackagePlus, Play } from "lucide-react";
import { ReactNode, useState } from "react";
import { useLocation } from "react-router";
import { match } from "ts-pattern";

enum Status
{
    READY,
    PREPARING,
    PLAYING
}

interface PageState
{
    game: GamePropertiesDTO;
    profile: ProfileDTO;
}

export default function ProfilePage()
{
    const { state } = useLocation();
    const { game, profile } = state as PageState;

    const [status, setStatus] = useState<Status>(Status.READY);
    const [mods, setMods] = useState<
        ReadonlyArray<Readonly<{ id: string; name: string; version: string; author: string }>>
    >([
        {
            id: "1",
            name: "Mod 1",
            version: "1.0.0",
            author: "Gragas"
        },
        {
            id: "2",
            name: "Mod 2",
            version: "1.0.0",
            author: "Gragas"
        },
        {
            id: "3",
            name: "Mod 3",
            version: "1.0.0",
            author: "Gragas"
        },
        {
            id: "4",
            name: "Mod 4",
            version: "1.0.0",
            author: "Gragas"
        },
        {
            id: "5",
            name: "Mod 5",
            version: "1.0.0",
            author: "Gragas"
        }
    ]);

    /* ================================== */

    const onClickStart = () =>
    {};

    const onClickInstallMods = () =>
    {};

    /* ================================== */

    const renderActionButton = (
        icon: ReactNode,
        label: string,
        onClick?: () => void,
        disabled = false,
        secondary?: boolean
    ) => (
        <Button
            onClick={onClick}
            disabled={disabled}
            className="flex gap-2"
            variant={secondary ? "secondary" : "primary"}
        >
            {icon}
            {label}
        </Button>
    );

    const renderStatusActionButton = () =>
        match(status)
            .with(Status.READY, () => renderActionButton(<Play />, "START", onClickStart))
            .with(Status.PREPARING, () =>
                renderActionButton(<LoaderCircle className="animate-spin" />, "PREPARING", undefined, true)
            )
            .with(Status.PLAYING, () => renderActionButton(<Play />, "RUNNING", undefined, true))
            .otherwise(() => null);

    /* ================================== */

    if (game === undefined || profile === undefined)
    {
        return <p>Internal Error</p>;
    }

    return (
        <main className="min-h-screen">
            <div className="w-full relative h-65 overflow-hidden -z-1">
                <img
                    className="w-full h-full object-cover blur-sm scale-102 brightness-25"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                    alt={game.details.name}
                />
                <div className="absolute bottom-6 left-6 flex gap-4">
                    <img
                        className="h-22 border border-border"
                        src={ResourcesUtil.linkGameAsset("ZENLESS_ZONE_ZERO", "048617ceb68b40a45847078db347ba59.png")}
                        alt={"test"}
                    />
                    <h1 className="text-text text-4xl font-semibold my-auto">{profile.name}</h1>
                </div>
            </div>
            <div className="px-6 pb-6">
                <div className="space-y-2 border-t border-border overflow-hidden">
                    <div className="flex gap-2 py-4">
                        {renderStatusActionButton()}
                        {renderActionButton(<PackagePlus />, "INSTALL MODS", onClickInstallMods, false, true)}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {mods.map((mod) => (
                        <ModCard key={mod.id} mod={mod} />
                    ))}
                </div>
            </div>
        </main>
    );
}
