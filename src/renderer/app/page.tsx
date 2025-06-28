import { Transition } from '@tailwindui/react'
import { useEffect, useRef, useState } from 'react'
import { listGames, verifyGame } from '@renderer/api/game'
import { GameInformation } from '@common/games'
import { useNavigate } from 'react-router'
import SetupGameModal from '@renderer/components/SetupGameModal'

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [games, setGames] = useState<GameInformation[]>([])
  const [context, setContext] = useState<GameInformation | null>(null)
  const setupInputRef = useRef<HTMLInputElement>(null)

  const onClickGame = (game: GameInformation) => {
    setContext(game)
    verifyGame(game.id).then((result) => {
      if (result.success) {
        setLoading(true)
        navigate(`/game/${game.id}`)
        return
      }

      const reason: string = result.reason
      switch (reason) {
        case 'GAME_NOT_INITIALIZED': {
          setSetupModalOpen(true)
          if (setupInputRef.current) {
            setupInputRef.current.value = result.path as string
          }
          break
        }
      }
    })
  }

  useEffect(() => {
    listGames().then((result: GameInformation[]) => {
      setGames(result)
      setLoading(false)
    })
  }, [])

  return (
    <main className="relative w-full h-full p-4 pt-12 overflow-hidden flex">
      <SetupGameModal
        open={setupModalOpen}
        onChangeOpen={setSetupModalOpen}
        game={context}
        inputRef={setupInputRef}
        onClickCancel={() => setSetupModalOpen(false)}
        onSetupSuccess={() => {
          setSetupModalOpen(false)
          onClickGame(context)
        }}
      />
      <div className="w-full overflow-hidden overflow-x-auto scrollbar-none">
        <Transition
          show={!loading}
          enter="transition-all duration-400 ease-in-out"
          enterFrom="opacity-0 -mb-4"
          enterTo="opacity-100 mb-0"
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl underline decoration-text-100/30 underline-offset-5">All Games</h1>
            <div className="flex gap-3">
              {games.map((game) => (
                <div
                  className="relative w-72 shrink-0 flex flex-col border-background-700 hover:border-primary-500 transition-color duration-300 border-2 rounded-lg overflow-hidden cursor-pointer group"
                  key={game.id}
                  onClick={() => onClickGame(game)}
                >
                  <div className="relative w-full aspect-15/7 pointer-events-none select-none">
                    <div
                      className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-300 top-0 left-0 w-full h-full bg-linear-to-t from-background-900 via-background-900/35 to-background-900/0 z-2" />
                    <img
                      className="w-full h-full group-hover:scale-105 transition-translate duration-300"
                      src={game.banner}
                      alt={`${game.name}'s banner`}
                    />
                  </div>
                  <div
                    className="absolute -bottom-8 left-0 opacity-0 group-hover:bottom-0 group-hover:opacity-100 select-none z-4 p-2 transition-translate duration-300 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <img className="w-12 h-12 rounded-xl" src={game.icon} alt={`${game.name}'s icon`} />
                      <div className="flex flex-col">
                        <p className="font-semibold">{game.name}</p>
                        <p className="-mt-1 text-gray-300">{game.developer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Transition>
      </div>
    </main>
  )
}
