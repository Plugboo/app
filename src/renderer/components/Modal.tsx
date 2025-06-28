import { ReactNode } from 'react'

type Props = {
  open: boolean
  onChangeOpen?: (open: boolean) => void
  children?: ReactNode | ReactNode[] | undefined
  classNames?: {
    childrenWrapper?: string
  }
}

export default function Modal(props: Props) {
  return (
    <div
      className={`${
        props.open ? 'pointer-events-auto' : 'pointer-events-none'
      } fixed top-0 left-0 w-screen h-screen overflow-hidden z-40`}
    >
      <div
        className={`${props.open ? 'opacity-100' : 'opacity-0'} relative backdrop-blur-sm transition-opacity duration-200 ease-in-out flex items-center justify-center bg-background-900/65 w-screen h-screen`}>
        <div className="absolute top-0 left-0 w-full h-screen" onClick={() => {
          if (props.onChangeOpen) {
            props.onChangeOpen(false)
          }
        }} />
        <div
          className={`min-w-32 min-h-32 bg-background-800 p-8 rounded-xl border-1 border-background-700 ${
            props.classNames ? props.classNames.childrenWrapper ?? '' : ''
          }`}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}
