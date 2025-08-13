import { Link, useParams } from 'react-router'
import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react'
import { Mod } from '@preload/types/service'
import Input from '@renderer/components/ui/Input'
import Button from '@renderer/components/ui/Button'
import { Check, Download, LoaderCircle, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import Select from '@renderer/components/ui/Select'
import ModStats from '@renderer/components/ModStats'
import Paginator from '@renderer/components/ui/Paginator'
import { getPendingInstalls, getProfile, installMod } from '@renderer/api/game'
import useModsSearch from '@renderer/hooks/useModsSearch'
import { toast } from 'react-toastify'

type ModStatus = 'notInstalled' | 'installing' | 'installed'

function ModCard(props: {
    mod: Mod
    index: number
    gameId: string
    profileId: string
    status: ModStatus
    onClickInstall: () => void
}) {
    const onClickInstall = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        props.onClickInstall()
    }

    return (
        <motion.div
            className="w-full h-27 bg-background-800/50 p-3 rounded-xl drop-shadow-2xl brightness-100 hover:brightness-88 transition-all duration-150 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.065 * props.index }}
        >
            <Link
                className="w-full h-full flex gap-4 overflow-hidden"
                to={`/game/${props.gameId}/profile/${props.profileId}/mods/${props.mod.id}`}
            >
                <div className="h-full aspect-square overflow-hidden rounded-lg shrink-0 outline-1 outline-white/20">
                    <img
                        className={`w-full h-full object-cover ${props.mod.nsfw ? 'blur-sm' : ''}`}
                        src={props.mod.media[0].smallImage.url}
                        alt={`${props.mod.name}'s screenshot`}
                    />
                </div>
                <div className="flex flex-col justify-between overflow-hidden grow-0">
                    <div className="flex flex-col">
                        <div className="flex gap-2 items-center">
                            <p className="font-semibold text-xl text-nowrap">{props.mod.name}</p>
                            {props.mod.nsfw && (
                                <p className="font-bold px-1.5 py-0.5 text-sm rounded-lg text-red-400 min-w-0 bg-red-600/30 grow-0 flex-none flex flex-row gap-4 h-6">
                                    NSFW
                                </p>
                            )}
                        </div>
                        <p className="font-medium text-base text-background-400 text-nowrap -mt-1">
                            {props.mod.author.name}
                        </p>
                    </div>
                    <ModStats mod={props.mod} />
                </div>
                <div className="ml-auto h-full flex flex-col gap-2 shrink-0">
                    <Button
                        className="mt-auto flex gap-2"
                        onClick={(e) => onClickInstall(e)}
                        disabled={props.status !== 'notInstalled'}
                    >
                        {props.status === 'notInstalled' && <Download />}
                        {props.status === 'installing' && (
                            <RefreshCcw className="animate-[spin_2s_linear_infinite_reverse]" />
                        )}
                        {props.status === 'installed' && <Check />}

                        {props.status === 'notInstalled' && 'Install'}
                        {props.status === 'installing' && 'Installing'}
                        {props.status === 'installed' && 'Installed'}
                    </Button>
                </div>
            </Link>
        </motion.div>
    )
}

export default function ModsPage() {
    const { gameId, profileId } = useParams()

    const [pendingInstalls, setPendingInstalls] = useState<string[]>([])
    const [installedMods, setInstalledMods] = useState<string[]>([])

    const [lastInput, setLastInput] = useState('')
    const [input, setInput] = useState('')
    const [sort, setSort] = useState<'new' | 'default' | 'updated'>('default')
    const [page, setPage] = useState(0)

    const searchHook = useModsSearch(gameId)

    const search = (force: boolean) => {
        if ((searchHook.loading && !force) || (!force && input === lastInput)) {
            return
        }

        setLastInput(input)
        searchHook.search(input, page + 1)
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            search(false)
        }
    }

    useEffect(() => {
        search(true)
    }, [sort, page])

    useEffect(() => {
        const event = window.electron.ipc.on('game/profiles/mods/install', (modId: string, successful: boolean) => {
            if (!successful) {
                toast.error(`Failed to install mod ${modId}!`)
                return
            }

            toast.success(`Successfully installed mod ${modId}!`)

            if (!installedMods.includes(modId)) {
                setInstalledMods((prev) => [...prev, modId])
            }
        })

        getProfile(profileId).then((result) => {
            setInstalledMods(result.mods.map((v) => v.id))
        })

        getPendingInstalls(profileId, 'gamebanana').then((result) => setPendingInstalls(result))

        return () => {
            event()
        }
    }, [profileId])

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
                    <Button type="secondary" onClick={() => search(true)} disabled={searchHook.loading}>
                        <RefreshCcw className={searchHook.loading ? 'animate-[spin_2s_linear_infinite_reverse]' : ''} />
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
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <div>
                            <Paginator
                                page={page}
                                maxPage={Math.round(searchHook.total / 15)}
                                onChangePage={(newPage: number) => {
                                    setPage(newPage)
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3 flex-auto overflow-hidden">
                            {searchHook.loading && (
                                <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
                                    <LoaderCircle className="animate-spin" />
                                    <h1>Loading</h1>
                                </div>
                            )}

                            {!searchHook.loading && searchHook.mods.length === 0 && (
                                <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
                                    <h1>No results found for your query!</h1>
                                </div>
                            )}

                            {!searchHook.loading && searchHook.mods.length > 0 && (
                                <div className="w-full flex flex-col gap-3 h-full">
                                    {searchHook.mods.map((mod: Mod, index) => (
                                        <ModCard
                                            key={mod.id}
                                            mod={mod}
                                            index={index}
                                            gameId={gameId}
                                            profileId={profileId}
                                            status={
                                                installedMods.includes(String(mod.id))
                                                    ? 'installed'
                                                    : pendingInstalls.includes(String(mod.id))
                                                      ? 'installing'
                                                      : 'notInstalled'
                                            }
                                            onClickInstall={() => {
                                                installMod(profileId, 'gamebanana', mod.id)
                                                setPendingInstalls((prev) => [...prev, mod.id])
                                            }}
                                        />
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
