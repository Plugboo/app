import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Settings, X } from 'lucide-react'

type Props = {
    open: boolean
    onChangeOpen: (open: boolean) => void
}

export default function SettingsModal(props: Props) {
    return (
        <Modal classNames={{
            childrenWrapper: 'min-w-208 min-h-102 relative overflow-hidden'
        }} open={props.open} onChangeOpen={props.onChangeOpen}>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                <div className="w-full p-6 flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                        <Settings className="w-4 h-4" />
                        <h1 className="font-bold text-lg">Settings</h1>
                    </div>
                    <Button className="ml-auto !rounded-full flex items-center justify-center w-8 !p-0 h-8"
                            type="secondary"
                            onClick={() => props.onChangeOpen(false)}>
                        <X />
                    </Button>
                </div>
                <div className="h-0.5 bg-background-700/30 rounded-full" />
                <div className="flex flex-row h-full w-full">
                    <div className="w-64 h-full p-6 shrink-0 rounded-tr-lg">

                    </div>
                    <div className="w-full h-full p-6">

                    </div>
                </div>
            </div>
        </Modal>
    )
}
