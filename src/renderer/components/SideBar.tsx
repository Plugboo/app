import { Home, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GameInformation } from '@common/games'
import { listGames } from '@renderer/api/game'
import { Link, useLocation } from 'react-router'

export default function SideBar() {
  const [games, setGames] = useState<GameInformation[]>([])
  const location = useLocation()

  useEffect(() => {
    listGames().then((result: GameInformation[]) => {
      setGames(result)
    })
  }, [])

  return (
    <div className="z-100 w-16 h-full shrink-0 grow-0">
      <div className="flex flex-col justify-between items-center h-full p-2 py-3 text-background-300">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center p-2 py-0 gap-4">
            <Link
              className={`
                rounded-xl transition-colors duration-150 hover:bg-background-600/40 p-1.5 w-10 h-10 flex items-center justify-center cursor-pointer 
                ${location.pathname === '/' ? 'outline-2 outline-primary-400/50 bg-background-600/40' : ''}
              `}
              to="/"
            >
              <Home className="w-full h-full" />
            </Link>
          </div>
          <div className="h-0.5 bg-background-700/35 mx-1 rounded-4xl" />
          <div className="flex flex-col items-center p-2 py-0 gap-4">
            {games.map((game: GameInformation) => (
              <div
                className="rounded-xl transition-all duration-150 brightness-70 hover:brightness-100 w-10 h-10 flex items-center justify-center cursor-pointer"
                key={game.id}>
                <img className="w-full h-full rounded-lg" src={game.icon} alt={`${game.name}'s icon`} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="rounded-xl transition-colors duration-150 hover:bg-background-600/40 p-1.5 w-10 h-10 flex items-center justify-center cursor-pointer">
          <Settings className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
