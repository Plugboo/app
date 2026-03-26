import { useLocation } from "react-router";
import { GamePropertiesDTO } from "@common/dto/game";
import { ResourcesUtil } from "@renderer/util/resources";

interface State
{
    game: GamePropertiesDTO;
}

export default function GameOverviewPage()
{
    const { state } = useLocation();
    const { game } = state as State;

    if (game === undefined)
    {
        return <p>Internal Error</p>;
    }

    return (
        <main>
            <div className="w-full h-90 relative">
                <img
                    className="w-full h-full object-cover object-top"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.hero)}
                    alt={game.details.name}
                />

                <img
                    className="absolute bottom-10 left-10 max-w-60 max-h-60 drop-shadow-lg drop-shadow-black"
                    src={ResourcesUtil.linkGameAsset(game.id, game.assets.logo)}
                    alt={game.details.name}
                />
            </div>
            <div className="flex gap-4 px-6 py-3">
                <div className="font-light text-[15px] -space-y-0.5">
                    <p>STATUS</p>
                    <span>Not Installed</span>
                </div>
            </div>
        </main>
    );
}
