import { useState } from 'react'
import { Transition } from '@tailwindui/react'
import { FileQuestionMark, Hammer, LoaderCircle, Play, Plus, Settings } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { startProfile } from '@renderer/api/game'
import Button from '@renderer/components/ui/Button'
import ProfileSettingsModal from '@renderer/components/modals/ProfileSettingsModal'
import Input from '@renderer/components/ui/Input'
import { LoaderStatus } from '@preload/types/loader'
import useProfile from '@renderer/hooks/useProfile'

export default function ProfilePage() {
    const { gameId, profileId } = useParams()
    const navigate = useNavigate()

    const { profile, loading } = useProfile(profileId)
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

    const onClickButton = () => {
        if (profile === null) {
            return
        }

        switch (profile.loaderStatus) {
            case LoaderStatus.NOT_INSTALLED:
                break
            case LoaderStatus.READY: {
                startProfile(profileId).then()
                break
            }
        }
    }

    /*
     * Render nothing when no current profile is set.
     */
    if (profile === null && !loading) {
        return null
    }

    return (
        <main className="w-full p-4">
            <Transition
                show={!loading}
                enter="transition-opacity duration-500 ease-in-out"
                enterFrom="opacity-0 pointer-events-none"
                enterTo="opacity-100 pointer-events-none"
            >
                {profile && (
                    <div className="flex flex-col gap-5">
                        <ProfileSettingsModal
                            open={settingsModalOpen}
                            onChangeOpen={setSettingsModalOpen}
                            profile={profile}
                        />
                        <div className="flex justify-between">
                            <div>
                                <h1 className="font-bold text-3xl">{profile.name}</h1>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex gap-2" onClick={() => onClickButton()}>
                                    {profile.loaderStatus === LoaderStatus.NOT_INSTALLED && (
                                        <>
                                            <Hammer />
                                            Repair
                                        </>
                                    )}
                                    {profile.loaderStatus === LoaderStatus.INSTALLING && (
                                        <>
                                            <LoaderCircle className="animate-spin" />
                                            Installing
                                        </>
                                    )}
                                    {profile.loaderStatus === LoaderStatus.READY && (
                                        <>
                                            <Play />
                                            Play
                                        </>
                                    )}
                                </Button>
                                <Button
                                    className="!px-2"
                                    rounded="full"
                                    type="secondary"
                                    onClick={() => setSettingsModalOpen(true)}
                                >
                                    <Settings />
                                </Button>
                            </div>
                        </div>
                        <div className="w-full bg-background-800 h-[2px]" />

                        <div className="w-full flex gap-4">
                            <Input
                                placeholder="Search mods..."
                                classNames={{
                                    wrapper: 'w-full'
                                }}
                            />
                            <Button
                                className="ml-auto shrink-0 flex gap-1 justify-center items-center"
                                type="secondary"
                                onClick={() => navigate(`/game/${gameId}/profile/${profileId}/mods`)}
                            >
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
                                    <h2 className="font-medium text-xl brightness-75">
                                        It seems that no mods are installed on this profile.
                                    </h2>
                                </div>
                            )}

                            {profile.mods.map((mod, index) => (
                                <div
                                    className={`w-full flex gap-3 p-4 ${index < profile.mods.length - 1 ? 'border-b-2 border-background-900/30' : ''}`}
                                    key={mod.id}
                                >
                                    <div className="h-16 aspect-square overflow-hidden rounded-lg shrink-0 outline-1 outline-white/20">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`profile://${profile.id}/${mod.id}/icon`}
                                            alt={`${mod.name}'s icon`}
                                        />
                                    </div>
                                    <p className="font-semibold">{mod.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Transition>
        </main>
    )
}
