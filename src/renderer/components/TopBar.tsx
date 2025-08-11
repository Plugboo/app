import { ChevronLeft, ChevronRight, Maximize, Minus, X } from 'lucide-react'
import { minimizeWindow, maximizeWindow, closeWindow } from '../api/window'
import { useNavigate } from 'react-router'

export default function TopBar() {
    const navigate = useNavigate()

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
        <div className="w-screen h-9.5 shrink-0 pointer-events-none z-99 flex bg-background-800/65">
            <div className="w-full h-full">
                <div className="flex items-center justify-between app-region-drag pointer-events-auto">
                    <div className="h-full flex gap-1 items-center mt-0.5 pl-1">
                        <button
                            className="flex items-center justify-center p-1 w-6 h-6 rounded-full transition-colors duration-100 bg-background-600/20 hover:bg-background-600/40 ml-auto cursor-pointer app-region-nodrag"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            className="flex items-center justify-center p-1 w-6 h-6 rounded-full transition-colors duration-100 bg-background-600/20 hover:bg-background-600/40 ml-auto cursor-pointer app-region-nodrag"
                            onClick={() => navigate(1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-1 items-center justify-center bg-background-800/40 rounded-lg overflow-hidden pr-1 mt-0.5">
                        <button
                            className="flex items-center justify-center p-1 w-8 h-8 rounded-lg transition-colors duration-100 hover:bg-background-600/40 ml-auto cursor-pointer app-region-nodrag"
                            onClick={() => onClickMinimize()}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <button
                            className="flex items-center justify-center p-1 w-8 h-8 rounded-lg transition-colors duration-100 hover:bg-background-600/40 cursor-pointer app-region-nodrag"
                            onClick={() => onClickMaximize()}
                        >
                            <Maximize className="w-4 h-4" />
                        </button>
                        <button
                            className="flex items-center justify-center p-1 w-8 h-8 rounded-lg transition-colors duration-100 hover:bg-background-600/40 cursor-pointer app-region-nodrag"
                            onClick={() => onClickClose()}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
