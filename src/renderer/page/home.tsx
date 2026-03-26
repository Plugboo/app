import { useEffect, useState } from "react";
import { GamePropertiesDTO } from "@common/dto/game";
import { invokeIpc } from "@renderer/ipc";

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
                    <div className="h-100" key={game.id}>
                        <img
                            className="h-full"
                            src={`resources/game/${game.id.toLowerCase()}/${game.assets.banner}`}
                            alt={game.name}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
