import { useEffect, useState } from 'react'
import { NewsArticle } from '@common/types/news'
import { getNewsFromAll } from '@renderer/api/game'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

export default function NewsSection() {
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getNewsFromAll().then((result) => {
            setNews(result)
            setLoading(false)
        })
    }, [])

    return <div className="flex gap-3 w-full overflow-hidden overflow-x-auto scrollbar-none h-44">
        {!loading && news.length > 0 && news.map((article, index) => (
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

        {(loading || (!loading && news.length === 0)) && (
            <div
                className="w-full px-4 py-3 h-full flex items-center justify-center text-text-200 select-none">
                {!loading && news.length === 0 && (
                    <p>No news available. Check back later!</p>
                )}

                {loading && (
                    <div className="flex gap-2.5 text-2xl items-center">
                        <LoaderCircle className="w-8 h-8 animate-spin" />
                        <p>Loading</p>
                    </div>
                )}
            </div>
        )}
    </div>
}