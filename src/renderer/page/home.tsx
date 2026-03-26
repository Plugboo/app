import { useEffect, useState } from "react";
import { GamePropertiesDTO } from "@common/dto/game";
import { invokeIpc } from "@renderer/ipc";

function GameCard({ game }: { game: GamePropertiesDTO })
{
    const [hovered, setHovered] = useState(false);
    const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

    const onMouseEnter = () =>
    {
        setDelayHandler(setTimeout(() => setHovered(true), 500));
    };

    const onMouseLeave = () =>
    {
        if (delayHandler !== null)
        {
            clearTimeout(delayHandler);
        }

        setHovered(false);
        setDelayHandler(null);
    };

    return (
        <div className="relative group" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="h-70 aspect-2/3 w-auto overflow-hidden drop-shadow-black drop-shadow-xl cursor-pointer group-hover:scale-102 transition-transform duration-200 border border-black">
                <img
                    className="h-full w-full group-hover:scale-103 transition-transform duration-200"
                    src={`resources/game/${game.id.toLowerCase()}/${game.assets.grid}`}
                    alt={game.name}
                />
            </div>
            <div
                className={`absolute top-0 left-full w-70 z-10 pointer-events-none ${hovered ? "opacity-100 transition-opacity duration-200" : "opacity-0"}`}
            >
                <div className="bg-gray-800 ml-4 -mt-0.5 z-10 relative overflow-hidden text-shadow-md/50 border border-black">
                    <img
                        className="absolute top-0 w-auto h-full blur-lg scale-140 -z-1"
                        src={`resources/game/${game.id.toLowerCase()}/${game.assets.hero}`}
                        alt={game.name}
                    />
                    <div className="bg-gray-800/50">
                        <div className="p-3 ">
                            <h3>{game.name}</h3>
                        </div>
                        <img
                            className="w-full h-32 object-cover"
                            src={`resources/game/${game.id.toLowerCase()}/${game.assets.hero}`}
                            alt={game.name}
                        />
                        <div className="p-3 font-light text-[15px] space-y-1">
                            <div className="-space-y-0.5">
                                <p>STATUS</p>
                                <span>Not Installed</span>
                            </div>
                            <div className="-space-y-0.5">
                                <p>TIME PLAYED</p>
                                <span>Total: 0 min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HomePage()
{
    const [games, setGames] = useState<ReadonlyArray<Readonly<GamePropertiesDTO>>>([]);

    useEffect(() =>
    {
        invokeIpc("game.list", {}).then(setGames);
    }, []);

    return (
        <main>
            <p>Home</p>

            <div className="flex gap-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </main>
    );
}
