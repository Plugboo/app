import { Home, Settings, X } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { GameInformation } from '@common/games'
import { listGames } from '@renderer/api/game'
import { Link, useLocation } from 'react-router'
import SettingsModal from '@renderer/components/SettingsModal'

interface Route {
  key: string
  href: string
  icon: ReactNode
}

const routes: Route[] = [
  {
    key: 'home',
    href: '/',
    icon: <Home className="w-full h-full" />
  }
]

export default function SideBar() {
  const [games, setGames] = useState<GameInformation[]>([])
  const location = useLocation()
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  useEffect(() => {
    listGames().then((result: GameInformation[]) => {
      setGames(result)
    })
  }, [])

  return (
    <div className="fixed left-0 top-0 z-40 w-16 h-full shrink-0 grow-0 border-r-2 border-background-700/30">
      <SettingsModal open={settingsMenuOpen} onChangeOpen={setSettingsMenuOpen} />
      <div className="flex flex-col justify-between items-center h-full p-2 py-3 text-background-300">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center p-2 py-0 gap-4">
            {routes.map((route: Route) => {
              const isSelected = location.pathname === route.href
              return <Link className={`
                relative rounded-xl ease-in-out transition-colors duration-150 hover:bg-background-600/65 p-1.5 w-10 h-10 flex items-center justify-center cursor-pointer
                ${isSelected ? 'bg-background-600/50' : ''}
              `} key={route.key} to={route.href}>
                {route.icon}
                <div
                  className={`absolute -left-4 rounded-r-lg  transition-colors duration-200 ease-in-out ${isSelected ? '!bg-primary-300/70' : ''} bg-primary-300/0 h-full w-2`} />
              </Link>
            })}
          </div>
          <div className="h-0.5 bg-background-700/35 mx-1 rounded-4xl" />
          <div className="flex flex-col items-center p-2 py-0 gap-4">
            {games.map((game: GameInformation) => {
              const isSelected = location.pathname.startsWith(`/game/${game.id}`)
              return <Link
                className={`rounded-xl transition-all duration-150 ease-in-out brightness-80 hover:brightness-100 ${isSelected ? 'brightness-95' : ''} w-10 h-10 flex items-center justify-center cursor-pointer`}
                key={game.id}
                to={`/game/${game.id}`}>
                <img className="w-full h-full rounded-lg" src={game.icon} alt={`${game.name}'s icon`} />
                <div
                  className={`absolute -left-4 rounded-r-lg  transition-colors duration-200 ease-in-out ${isSelected ? '!bg-primary-300/70' : ''} bg-primary-300/0 h-full w-2`} />
              </Link>
            })}
          </div>
        </div>
        <div
          className="rounded-xl transition-colors duration-150 ease-in-out hover:bg-background-600/65 p-1.5 w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setSettingsMenuOpen(true)}>
          <Settings className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
