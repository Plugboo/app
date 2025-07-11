import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Mod } from '@common/types/service'
import { getMod } from '@renderer/api/mods'
import { Download, Eye, Heart, LoaderCircle, MessageCircle } from 'lucide-react'
import Button from '@renderer/components/ui/Button'

export default function ModPage() {
    const { gameId, modId } = useParams()
    const [loading, setLoading] = useState(true)
    const [mod, setMod] = useState<Mod | null>(null)
    // const [comments, setComments] = useState<Comment[]>([])

    useEffect(() => {
        setLoading(true)
        getMod(gameId, modId).then((result) => {
            setMod(result)
            setLoading(false)

            // getModComments(gameId, modId, {}).then((result2) => {
            //   setComments(result2)
            // })
        })
    }, [gameId, modId])

    return <main className="w-full h-full p-4 overflow-hidden overflow-y-auto pb-4">
        <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading && (
                <div
                    className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
                    <LoaderCircle className="animate-spin" />
                    <h1>Loading</h1>
                </div>
            )}

            {!loading && mod !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-3 h-22">
                            <div
                                className="h-full aspect-square overflow-hidden rounded-lg shrink-0 outline-1 outline-white/20">
                                <img className="w-full h-full object-cover" src={mod.media[0].url}
                                     alt={`${mod.name}'s screenshot`} />
                            </div>
                            <div className="flex flex-col justify-between">
                                <h1 className="text-2xl font-semibold">{mod.name}</h1>
                                <div className="flex gap-4">
                                    <div className="flex gap-1 items-center">
                                        <Heart className="w-4 h-4 text-red-400" />
                                        <p className="text-text-400 font-semibold">{mod.likes}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <MessageCircle className="w-4 h-4 text-primary-400" />
                                        <p className="text-text-400 font-semibold">{mod.comments}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <Eye className="w-4 h-4 text-secondary-200 mt-0.5" />
                                        <p className="text-text-400 font-semibold">{mod.views}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center ml-auto h-full">
                                <Button className="flex gap-2">
                                    <Download />
                                    Install
                                </Button>
                            </div>
                        </div>
                        <div className="w-full bg-background-800 h-[2px] my-2" />
                        <div className="p-4 w-136 bg-background-800 rounded-2xl flex-none">
                            <div className="w-full h-64 overflow-hidden rounded-xl">
                                <img className="w-full h-full object-cover" src={mod.media[0].url}
                                     alt={`${mod.name}'s screenshot`} />
                            </div>
                        </div>
                        <div className="p-4 bg-background-800/50 rounded-2xl"
                             dangerouslySetInnerHTML={{ __html: mod.content }} />
                        {/*<div className="bg-background-800/50 rounded-2xl flex flex-col gap-0.5 overflow-hidden">*/}
                        {/*  {comments.map((comment) => (*/}
                        {/*    <div className="p-4 bg-background-800/80 w-full" key={comment.id}>*/}
                        {/*      <div dangerouslySetInnerHTML={{*/}
                        {/*        __html: comment.content*/}
                        {/*      }}></div>*/}
                        {/*    </div>*/}
                        {/*  ))}*/}
                        {/*</div>*/}
                    </div>
                </motion.div>
            )}
        </motion.div>
    </main>
}