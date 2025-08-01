import { Settings, X } from 'lucide-react'
import Modal from '@renderer/components/ui/Modal'
import Button from '@renderer/components/ui/Button'
import Input from '@renderer/components/ui/Input'
import { useEffect, useState } from 'react'
import { LoaderRData, LoaderVersion } from '../../../preload/types/loader'
import { createProfile, getLoaders } from '@renderer/api/game'
import Select from '@renderer/components/ui/Select'

type Props = {
    gameId: string | null
    open: boolean
    onChangeOpen: (open: boolean) => void
    onCreate?: () => void
}

export default function CreateProfileModal(props: Props) {
    const [loaders, setLoaders] = useState<LoaderRData[]>([])
    const [selectedLoader, setSelectedLoader] = useState<LoaderRData | null>(null)
    const [selectedVersion, setSelectedVersion] = useState<LoaderVersion | null>(null)
    const [name, setName] = useState('')

    const onClickCreate = () => {
        if (props.gameId === null || selectedLoader === null || selectedVersion === null || name.trim().length === 0) {
            return
        }

        createProfile(props.gameId, name, selectedLoader.id, selectedVersion.version).then((result) => {
            if (result) {
                props.onChangeOpen(false)

                if (props.onCreate) {
                    props.onCreate()
                }
            }
        })
    }

    const onSelectVersion = (value: string) => {
        if (selectedLoader === null) {
            return
        }

        setSelectedVersion(selectedLoader.versions.find((v) => v.version === value) ?? null)
    }

    useEffect(() => {
        if (props.gameId === null) {
            return
        }

        getLoaders(props.gameId).then((result) => {
            setLoaders(result)
            console.log(result)
        })
    }, [props.gameId])

    useEffect(() => {
        if (props.open) {
            setSelectedLoader(null)
        }
    }, [props.open])

    return (
        <Modal
            classNames={{
                childrenWrapper: 'min-w-140 min-h-100 relative'
            }}
            open={props.open}
            onChangeOpen={props.onChangeOpen}
        >
            <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                <div className="w-full p-6 flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                        <Settings className="w-4 h-4" />
                        <h1 className="font-bold text-lg">Create Profile</h1>
                    </div>
                    <Button
                        className="ml-auto !rounded-full flex items-center justify-center w-8 !p-0 h-8"
                        type="secondary"
                        onClick={() => props.onChangeOpen(false)}
                    >
                        <X />
                    </Button>
                </div>
                <div className="h-0.5 bg-background-700/30 rounded-full" />
                <div className="flex flex-row h-full w-full">
                    <div className="w-full h-full p-6 flex flex-col gap-4">
                        <div className="space-y-1">
                            <h2>Name</h2>
                            <Input onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <h2>Loader</h2>
                            <div className="space-y-2">
                                <Select
                                    placeholder="Select a loader.."
                                    onSelect={(value) => setSelectedLoader(loaders.find((v) => v.id === value) ?? null)}
                                    values={loaders.map((loader) => ({
                                        value: loader.id,
                                        label: loader.name
                                    }))}
                                />
                                {selectedLoader !== null && (
                                    <Select
                                        placeholder="Select a version.."
                                        onSelect={(value) => onSelectVersion(value)}
                                        values={selectedLoader.versions.map((version) => ({
                                            value: version.version,
                                            label: version.version
                                        }))}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="mt-auto flex ml-auto gap-4 select-none">
                            <Button type="secondary" onClick={() => props.onChangeOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={onClickCreate}>Create</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
