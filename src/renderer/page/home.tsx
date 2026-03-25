import { useEffect, useState } from "react";
import { invokeIpc } from "@renderer/ipc";
import { GamePropertiesDTO } from "@common/dto/game";

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

            {games.map((game) => (
                <p key={game.id}>{game.name}</p>
            ))}
        </main>
    );
}
