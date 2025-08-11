import { Maximize, Minus, X } from 'lucide-react'
import { minimizeWindow, maximizeWindow, closeWindow } from '../api/window'

export default function TopBar() {
    const onClickMinimize = () => {
        minimizeWindow().then(null)
    }

    const onClickMaximize = () => {
        maximizeWindow().then(null)
    }

    const onClickClose = () => {
        closeWindow().then(null)
    }

    return (
        <div className="w-screen h-6 shrink-0 app-region-drag pointer-events-auto z-99 bg-background-800/50">
            <div className="w-full h-full flex items-center justify-between overflow-hidden">
                <div className="w-16 h-full bg-background-700/25 border-r-2 border-background-800" />
                <div className="flex gap-1 items-center h-full">
                    <button
                        className="flex items-center justify-center p-1 w-8 transition-colors duration-100 hover:bg-background-600/40 ml-auto cursor-pointer app-region-nodrag"
                        onClick={() => onClickMinimize()}
                    >
                        <Minus className="w-3.5 aspect-square" />
                    </button>
                    <button
                        className="flex items-center justify-center p-1 w-8 transition-colors duration-100 hover:bg-background-600/40 cursor-pointer app-region-nodrag"
                        onClick={() => onClickMaximize()}
                    >
                        <Maximize className="w-3.5 aspect-square" />
                    </button>
                    <button
                        className="flex items-center justify-center p-1 w-8 transition-colors duration-100 hover:bg-background-600/40 cursor-pointer app-region-nodrag"
                        onClick={() => onClickClose()}
                    >
                        <X className="w-3.5 aspect-square" />
                    </button>
                </div>
            </div>
        </div>
    )
}
