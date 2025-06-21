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
    <div className="fixed z-100 w-screen h-12 app-region-drag">
      <div className="flex m-3 mr-3 gap-1">
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
  )
}
