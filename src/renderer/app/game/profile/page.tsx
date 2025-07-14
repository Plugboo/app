import { useEffect, useState } from 'react'
import { Transition } from '@tailwindui/react'
import { FileQuestionMark, Hammer, LoaderCircle, Play, Plus, Settings } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { getProfile } from '@renderer/api/game'
import Button from '@renderer/components/ui/Button'
import ProfileSettingsModal from '@renderer/components/modals/ProfileSettingsModal'
import Input from '@renderer/components/ui/Input'
import { ProfileRData } from '@common/types/profile'

enum Status {
    UNKNOWN,
    REPAIRING = 'REPAIRING',
    INSTALLING = 'INSTALLING',
    READY = 'READY',
    PLAYING = 'PLAYING',
}

export default function ProfilePage() {
    const { gameId, profileId } = useParams()
    const navigate = useNavigate()

    const [profile, setProfile] = useState<ProfileRData | null>(null)
    const [loading, setLoading] = useState(true)
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const [status, setStatus] = useState<Status>(Status.UNKNOWN)

    useEffect(() => {
        getProfile(profileId).then((result) => {
            setProfile(result)
            setLoading(false)
            setStatus(Status.READY)
        })
    }, [profileId])

    /*
     * Render nothing when no current profile is set.
     */
    if (profile === null && !loading) {
        return null
    }

    return <main className="w-full p-4">
        <Transition
            show={!loading}
            enter="transition-opacity duration-500 ease-in-out"
            enterFrom="opacity-0 pointer-events-none"
            enterTo="opacity-100 pointer-events-none"
        >
            {profile && (
                <div className="flex flex-col gap-5">
                    <ProfileSettingsModal open={settingsModalOpen} onChangeOpen={setSettingsModalOpen}
                                          profile={profile} />
                    <div className="flex justify-between">
                        <div>
                            <h1 className="font-bold text-3xl">{profile.name}</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex gap-2" disabled={status === Status.PLAYING}>
                                {status === Status.UNKNOWN && (
                                    <>
                                        <Hammer />
                                        Repair
                                    </>
                                )}
                                {status === Status.INSTALLING && (
                                    <>
                                        <LoaderCircle className="animate-spin" />
                                        Installing
                                    </>
                                )}
                                {status === Status.READY && (
                                    <>
                                        <Play />
                                        Play
                                    </>
                                )}
                                {status === Status.PLAYING && (
                                    <>
                                        <LoaderCircle className="animate-spin" />
                                        Playing
                                    </>
                                )}
                            </Button>
                            <Button className="!px-2" rounded="full" type="secondary"
                                    onClick={() => setSettingsModalOpen(true)}>
                                <Settings />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full bg-background-800 h-[2px]" />

                    <div className="w-full flex gap-4">
                        <Input placeholder="Search mods..." classNames={{
                            wrapper: 'w-full'
                        }} />
                        <Button className="ml-auto shrink-0 flex gap-1 justify-center items-center"
                                type="secondary"
                                onClick={() => navigate(`/game/${gameId}/profile/${profileId}/mods`)}>
                            <Plus />
                            Install Mods
                        </Button>
                    </div>

                    <div className="w-full rounded-2xl bg-background-800 min-h-16 border-2 border-background-700/80">
                        {profile.mods.length === 0 && (
                            <div className="flex flex-col gap-4 items-center justify-center h-32">
                                <div className="flex flex-row items-center gap-2">
                                    <FileQuestionMark />
                                    <h1 className="font-semibold text-2xl">No Mods installed</h1>
                                </div>
                                <h2 className="font-medium text-xl brightness-75">It seems that no mods are installed on
                                    this
                                    profile.</h2>
                            </div>
                        )}

                        {profile.mods.map((mod, index) => (
                            <div
                                className={`w-full h-16 p-4 ${index < profile.mods.length - 1 ? 'border-b-1 border-background-700' : ''}`}
                                key={mod.id}>
                                <p>{mod.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Transition>
    </main>
}
