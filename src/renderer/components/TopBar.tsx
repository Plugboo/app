import { Maximize, Minus, X } from 'lucide-react'
import { minimizeWindow, maximizeWindow, closeWindow } from '../api/window'
import { ReactNode } from 'react'
import useTopbar from '@renderer/hooks/useTopbar'

function WindowButton(props: { onClick: () => void; icon: ReactNode }) {
    return (
        <button
            className="flex items-center justify-center p-1 w-8 rounded-full transition-colors duration-100 hover:bg-background-600/40 ml-auto cursor-pointer app-region-nodrag"
            onClick={() => props.onClick()}
        >
            <div className="aspect-square text-text-100/70">{props.icon}</div>
        </button>
    )
}

const BUTTONS = [
    {
        onClick: () => minimizeWindow(),
        icon: <Minus className="w-4 aspect-square" />
    },
    {
        onClick: () => maximizeWindow(),
        icon: <Maximize className="w-4 aspect-square" />
    },
    {
        onClick: () => closeWindow(),
        icon: <X className="w-4 aspect-square" />
    }
]

export default function TopBar() {
    const enabled = useTopbar()

    return (
        <div className="w-screen h-10 shrink-0 app-region-drag pointer-events-auto flex items-center justify-end bg-background-700/45">
            {enabled && (
                <div className="flex gap-1 items-center h-full z-100 pr-1">
                    {BUTTONS.map((button) => (
                        <WindowButton onClick={button.onClick} icon={button.icon} />
                    ))}
                </div>
            )}
        </div>
    )
}
