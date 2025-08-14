import { useEffect, useRef, useState } from 'react'
import { listGames, verifyGame } from '@renderer/api/game'
import { GameInformation } from '@preload/types/game'
import { useNavigate } from 'react-router'
import SetupGameModal from '@renderer/components/modals/SetupGameModal'
import { motion } from 'framer-motion'

export default function HomePage() {
    const navigate = useNavigate()
    const [setupModalOpen, setSetupModalOpen] = useState(false)
    const [games, setGames] = useState<GameInformation[]>([])
    const [context, setContext] = useState<GameInformation | null>(null)
    const setupInputRef = useRef<HTMLInputElement>(null)

    const onClickGame = (game: GameInformation) => {
        setContext(game)
        verifyGame(game.id).then((result) => {
            if (result.success) {
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
        })
    }, [])

    return (
        <main className="relative w-full h-full">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full h-full">
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-xl">All Games</h1>
                    <div className="flex gap-3">
                        {games.map((game) => (
                            <div
                                className="relative w-50 aspect-2/3 shrink-0 flex flex-col border-background-700 hover:border-primary-500 transition-color duration-300 drop-shadow-lg border-2 rounded-lg overflow-hidden cursor-pointer group"
                                key={game.id}
                                onClick={() => onClickGame(game)}
                            >
                                <div className="relative w-full h-full pointer-events-none select-none">
                                    <div className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-300 top-0 left-0 w-full h-full bg-linear-to-t from-background-900 via-background-900/35 to-background-900/0 z-2" />
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-103 transition-translate duration-300"
                                        src={game.cover}
                                        alt={`${game.name}'s banner`}
                                    />
                                </div>
                                <div className="absolute -bottom-12 left-0 opacity-0 group-hover:bottom-0 group-hover:opacity-100 select-none z-4 p-2 transition-translate duration-300 pointer-events-none">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col text-sm">
                                            <p className="font-semibold">{game.name}</p>
                                            <p className="-mt-1 font-semibold text-background-400">{game.developer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </main>
    )
}
