import { Anvil, Maximize, Minus, X } from 'lucide-react'
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
    <div className="z-100 w-screen h-12 app-region-drag shrink-0 flex items-center justify-between px-2">
      <div className="flex gap-1.5 items-center ml-2">
        <Anvil className="text-primary-300" />
        <h1 className="font-semibold text-xl flex">Gacha<h1 className="text-primary-300">Forge</h1></h1>
      </div>
      <div className="flex gap-1 justify-center bg-background-900/20 rounded-xl overflow-hidden">
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
