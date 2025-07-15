import { Link, useParams } from 'react-router'
import React, { KeyboardEvent, MouseEvent, useEffect, useState } from 'react'
import { getCategories, searchMods } from '@renderer/api/mods'
import { Category, Mod, SearchModsResponse } from '@common/types/service'
import Input from '@renderer/components/ui/Input'
import Button from '@renderer/components/ui/Button'
import { Download, LoaderCircle, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import Select from '@renderer/components/ui/Select'
import ModStats from '@renderer/components/ModStats'
import Paginator from '@renderer/components/ui/Paginator'

export default function ModsPage() {
    const { gameId, profileId } = useParams()

    const [result, setResult] = useState<SearchModsResponse>({
        mods: [],
        totalCount: 0
    })
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const [lastInput, setLastInput] = useState('')
    const [input, setInput] = useState('')
    const [sort, setSort] = useState<'new' | 'default' | 'updated'>('default')
    const [view, setView] = useState(15)
    const [page, setPage] = useState(0)

    const search = (force: boolean, sortOption?: string) => {
        if ((loading && !force) || (!force && input === lastInput)) {
            return
        }

        setLoading(true)
        setLastInput(input)
        searchMods(gameId, {
            page: page + 1,
            query: input,
            sort: (sortOption as any) ?? sort
        }).then((result) => {
            console.log('[ModsPage] Search result:', result)
            setResult(result)
            setLoading(false)
        })
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            search(false)
        }
    }

    const onClickInstall = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
    }

    useEffect(() => {
        search(true)
    }, [sort, page, view])

    useEffect(() => {
        getCategories(gameId).then((result) => {
            setCategories(result)
            search(true)
        })
    }, [gameId])

    return (
        <main className="w-full h-full p-4">
            <motion.div className="flex flex-col gap-4 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex gap-2.5">
                    <Input
                        classNames={{
                            wrapper: 'w-full'
                        }}
                        placeholder="Search mods..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onInputKeyDown}
                    />
                    <Button type="secondary" onClick={() => search(true)} disabled={loading}>
                        <RefreshCcw className={loading ? 'animate-[spin_2s_linear_infinite_reverse]' : ''} />
                    </Button>
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-3 flex-none h-[0%] w-60">
                        <div className="flex flex-col gap-2 p-4 bg-background-800 rounded-2xl">
                            <h1 className="font-semibold text-xl">Options</h1>
                            <Select
                                prefix="Sort by: "
                                values={[
                                    {
                                        value: 'default',
                                        label: 'Ripe'
                                    },
                                    {
                                        value: 'new',
                                        label: 'Newest'
                                    },
                                    {
                                        value: 'updated',
                                        label: 'Updated'
                                    }
                                ]}
                                defaultValue="default"
                                onSelect={(value) => {
                                    setSort(value as any)
                                }}
                            />
                            <Select
                                prefix="View: "
                                values={[
                                    {
                                        value: '5',
                                        label: '5'
                                    },
                                    {
                                        value: '10',
                                        label: '10'
                                    },
                                    {
                                        value: '15',
                                        label: '15'
                                    },
                                    {
                                        value: '20',
                                        label: '20'
                                    }
                                ]}
                                defaultValue="15"
                                onSelect={(value) => {
                                    setView(Number(value))
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-background-800 rounded-2xl">
                            <h1 className="font-semibold text-xl">Categories</h1>
                            <div className="flex flex-col">
                                {categories.map((category: Category) => (
                                    <div
                                        className="flex gap-2 rounded-2xl cursor-pointer transition-colors duration-150 ease-in-out hover:bg-background-700 p-2"
                                        key={category.id}
                                    >
                                        <div className="w-12 h-12 p-1.5 bg-background-900/35 rounded-xl">
                                            <img
                                                className="w-full h-full object-contain"
                                                src={category.iconUrl}
                                                alt={`${category.name}'s icon`}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-background-200 font-medium">{category.name}</p>
                                            <p className="text-background-300 font-normal">{category.itemCount}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <div>
                            <Paginator
                                maxPage={Math.round(result.totalCount / 15)}
                                onChangePage={(newPage: number) => {
                                    setPage(newPage)
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3 flex-auto overflow-hidden">
                            {loading && (
                                <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
                                    <LoaderCircle className="animate-spin" />
                                    <h1>Loading</h1>
                                </div>
                            )}

                            {!loading && result.mods.length === 0 && (
                                <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
                                    <h1>No results found for your query!</h1>
                                </div>
                            )}

                            {!loading && result.mods.length > 0 && (
                                <div className="w-full flex flex-col gap-3 h-full">
                                    {result.mods.map((record: Mod, index) => (
                                        <motion.div
                                            className="w-full h-27 bg-background-800/50 p-3 rounded-xl drop-shadow-2xl brightness-100 hover:brightness-88 transition-all duration-150 cursor-pointer"
                                            key={record.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.065 * index }}
                                        >
                                            <Link
                                                className="w-full h-full flex gap-4 overflow-hidden"
                                                key={record.id}
                                                to={`/game/${gameId}/profile/${profileId}/mods/${record.id}`}
                                            >
                                                <div className="h-full aspect-square overflow-hidden rounded-lg shrink-0 outline-1 outline-white/20">
                                                    <img
                                                        className={`w-full h-full object-cover ${record.nsfw ? 'blur-sm' : ''}`}
                                                        src={record.media[0].url}
                                                        alt={`${record.name}'s screenshot`}
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-between overflow-hidden grow-0">
                                                    <div className="flex flex-col">
                                                        <div className="flex gap-2 items-center">
                                                            <p className="font-semibold text-xl text-nowrap">
                                                                {record.name}
                                                            </p>
                                                            {record.nsfw && (
                                                                <p className="font-bold px-1.5 py-0.5 text-sm rounded-lg text-red-400 min-w-0 bg-red-600/30 grow-0 flex-none flex flex-row gap-4 h-6">
                                                                    NSFW
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="font-medium text-base text-background-400 text-nowrap -mt-1">
                                                            {record.author.name}
                                                        </p>
                                                    </div>
                                                    <ModStats mod={record} />
                                                </div>
                                                <div className="ml-auto h-full flex flex-col gap-2 shrink-0">
                                                    <Button className="mt-auto flex gap-2" onClick={onClickInstall}>
                                                        <Download />
                                                        Install
                                                    </Button>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}
