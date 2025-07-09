import { useEffect, useRef, useState } from 'react'
import { getNewsFromAll, listGames, verifyGame } from '@renderer/api/game'
import { GameInformation } from '@common/games'
import { useNavigate } from 'react-router'
import SetupGameModal from '@renderer/components/SetupGameModal'
import { NewsArticle } from '@common/news'
import { motion } from 'framer-motion'

export default function HomePage() {
    const navigate = useNavigate()
    const [setupModalOpen, setSetupModalOpen] = useState(false)
    const [games, setGames] = useState<GameInformation[]>([])
    const [context, setContext] = useState<GameInformation | null>(null)
    const [news, setNews] = useState<NewsArticle[]>([])
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

        getNewsFromAll().then((result) => {
            setNews(result)
        })
    }, [])

    return (
        <main className="relative w-full h-full p-4 pt-12 overflow-hidden flex overflow-y-auto scrollbar-none">
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
                <div className="flex flex-col gap-4 w-full">
                    <h1 className="font-semibold text-xl">News</h1>
                    <div className="flex gap-3 w-full overflow-hidden overflow-x-auto scrollbar-none h-44">
                        {news.map((article, index) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ delay: 0.04 * index }}
                                        className="flex flex-col gap-0.5 w-60 shrink-0">
                                <div
                                    className="w-full aspect-16/9 shrink-0 flex flex-col border-background-700 hover:border-primary-500 transition-color duration-300 border-2 rounded-lg overflow-hidden cursor-pointer group">
                                    {article.coverUrl.length > 0 && (
                                        <img src={article.coverUrl} alt={`${article.title}'s cover`}
                                             className="w-full h-full object-cover group-hover:scale-103 transition-translate duration-300" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-normal text-text-200 line-clamp-2">{article.title}</p>
                                </div>
                            </motion.div>
                        ))}

                        {news.length === 0 && (
                            <div
                                className="w-full px-4 py-3 bg-background-800/40 rounded-xl h-full flex items-center justify-center text-text-200">
                                <p>No news available. Check back later!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-xl">All
                        Games</h1>
                    <div className="flex gap-3">
                        {games.map((game) => (
                            <div
                                className="relative w-50 aspect-2/3 shrink-0 flex flex-col border-background-700 hover:border-primary-500 transition-color duration-300 drop-shadow-lg border-2 rounded-lg overflow-hidden cursor-pointer group"
                                key={game.id}
                                onClick={() => onClickGame(game)}
                            >
                                <div className="relative w-full h-full pointer-events-none select-none">
                                    <div
                                        className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-300 top-0 left-0 w-full h-full bg-linear-to-t from-background-900 via-background-900/35 to-background-900/0 z-2" />
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-103 transition-translate duration-300"
                                        src={game.banner}
                                        alt={`${game.name}'s banner`}
                                    />
                                </div>
                                <div
                                    className="absolute -bottom-12 left-0 opacity-0 group-hover:bottom-0 group-hover:opacity-100 select-none z-4 p-2 transition-translate duration-300 pointer-events-none">
                                    <div className="flex items-center gap-2">
                                        <img className="w-10 h-10 rounded-xl" src={game.icon}
                                             alt={`${game.name}'s icon`} />
                                        <div className="flex flex-col text-sm">
                                            <p className="font-semibold">{game.name}</p>
                                            <p className="-mt-1 font-semibold text-text-400">{game.developer}</p>
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
