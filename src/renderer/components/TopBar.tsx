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
    <div className="z-99 fixed w-screen pl-18 h-10.5 shrink-0 pr-1.5 pointer-events-none">
      <div className="w-full h-full flex justify-end items-center app-region-drag pointer-events-auto">
        <div className="flex gap-1 justify-center bg-background-800/40 rounded-lg overflow-hidden">
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
  )
}
