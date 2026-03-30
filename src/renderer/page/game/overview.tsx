import { GamePropertiesDTO } from "@common/dto/game";
import { IpcChannels } from "@common/ipc/channel";
import Button from "@renderer/component/ui/button";
import { invokeIpc } from "@renderer/ipc";
import { ResourcesUtil } from "@renderer/util/resources";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function ProfileCard()
{
    return (
        <div className="flex gap-4 w-full p-4 bg-gray-800/30 border border-mauve-700/60 drop-shadow-lg drop-shadow-black">
            <img
                className="h-12"
                src={ResourcesUtil.linkGameAsset("ZENLESS_ZONE_ZERO", "048617ceb68b40a45847078db347ba59.png")}
                alt={"test"}
            />
            <div>
                <h3 className="text-lg font-semibold">Test</h3>
                <p className="text-sm text-gray-400">Test</p>
            </div>
        </div>
    );
}

interface PageState
{
    game: GamePropertiesDTO;
}

export default function GameOverviewPage()
{
    const { state } = useLocation();
    const { game } = state as PageState;

    const [content, setContent] = useState<IpcChannels["game.content.get"]["return"]>(null);
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(true);
    const [installed, setInstalled] = useState<boolean>(false);

    /**
     * Temporary.
     */
    const profiles = [
        {
            id: "1",
            name: "Test"
        },
        {
            id: "2",
            name: "Test"
        },
        {
            id: "3",
            name: "Test"
        },
        {
            id: "4",
            name: "Test"
        },
        {
            id: "5",
            name: "Test"
        },
        {
            id: "6",
            name: "Test"
        },
        {
            id: "7",
            name: "Test"
        }
    ];

    const onClickLocate = () =>
    {
        setButtonsDisabled(true);
        setTimeout(() =>
        {
            invokeIpc("game.installation.locate", { id: game.id }).then((result) =>
            {
                console.log(result);
                setButtonsDisabled(false);
            });
        }, 1000);
    };

    useEffect(() =>
    {
        if (game === undefined)
        {
            return;
        }

        setInstalled(false);

        invokeIpc("game.installation.verify", { id: game.id }).then((result) =>
        {
            setInstalled(result);
            setButtonsDisabled(false);
        });

        invokeIpc("game.content.get", { id: game.id }).then(setContent);
    }, [game]);

    if (game === undefined)
    {
        return <p>Internal Error</p>;
    }

    return (
        <main className="relative min-h-screen">
            <div className="top-0 left-0 bottom-0 right-0 overflow-hidden absolute -z-1">
                <img
                    className="w-full h-120 object-cover object-top"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                    alt={game.details.name}
                />
                <img
                    className="w-full h-full object-cover opacity-10 scale-125 blur-lg"
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
            <div className="px-6 pb-4 space-y-2 backdrop-blur-md bg-(--background-color)/40 border-t border-mauve-700/80">
                <div className="flex gap-8 py-4">
                    {installed && <Button disabled={buttonsDisabled}>Create Profile</Button>}
                    {!installed && (
                        <Button disabled={buttonsDisabled} onClick={onClickLocate}>
                            Locate Installation
                        </Button>
                    )}

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
                            <ProfileCard key={profile.id} />
                        ))}
                    </div>
                    <div>
                        {content && (
                            <div className="flex flex-col gap-4">
                                <p className="text-lg font-medium">ACTIVE BANNERS</p>
                                {content.banners.map((banner) => (
                                    <div
                                        key={banner.imageUrl}
                                        className="h-50 p-3 aspect-video bg-gray-800/30 border border-mauve-700/60 drop-shadow-lg drop-shadow-black"
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
