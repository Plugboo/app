import { Settings, X } from 'lucide-react'
import Modal from '@renderer/components/Modal'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import Dropdown from '@renderer/components/Dropdown'

type Props = {
    open: boolean
    onChangeOpen: (open: boolean) => void
}

export default function CreateProfileModal(props: Props) {
    return (
        <Modal classNames={{
            childrenWrapper: 'min-w-140 min-h-90 relative'
        }} open={props.open} onChangeOpen={props.onChangeOpen}>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                <div className="w-full p-6 flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                        <Settings className="w-4 h-4" />
                        <h1 className="font-bold text-lg">Create Profile</h1>
                    </div>
                    <Button className="ml-auto !rounded-full flex items-center justify-center w-8 !p-0 h-8"
                            type="secondary"
                            onClick={() => props.onChangeOpen(false)}>
                        <X />
                    </Button>
                </div>
                <div className="h-0.5 bg-background-700/30 rounded-full" />
                <div className="flex flex-row h-full w-full">
                    <div className="w-full h-full p-6 flex flex-col gap-4">
                        <div className="space-y-1">
                            <h2>Name</h2>
                            <Input />
                        </div>
                        <div className="space-y-1">
                            <h2>Loader</h2>
                            <Dropdown values={[
                                {
                                    value: '3.3.0',
                                    label: 'v3.3.0'
                                },
                                {
                                    value: '3.2.0',
                                    label: 'v3.2.0'
                                },
                                {
                                    value: '3.1.0',
                                    label: 'v3.1.0'
                                },
                                {
                                    value: '3.0.0',
                                    label: 'v3.0.0'
                                }
                            ]} />
                        </div>
                        <div className="mt-auto flex ml-auto gap-4 select-none">
                            <Button type="secondary" onClick={() => props.onChangeOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => props.onChangeOpen(false)}>Create</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
