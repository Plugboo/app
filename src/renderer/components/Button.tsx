import { ReactNode } from 'react'

type Type = 'primary' | 'secondary'

type Props = {
  className?: string
  rounded?: "lg" | "xl" | "2xl" | "3xl"
  children?: ReactNode | ReactNode[] | undefined
  type?: Type
  onClick?: () => void
}

function getClassesForType(type: Type): string {
  switch (type) {
    case 'primary':
      return 'bg-primary-400 hover:brightness-[90%] text-black'
    case 'secondary':
      return 'bg-secondary-700 brightness-[110%] hover:brightness-[100%]'
    default:
      return ''
  }
}

export default function Button(props: Props) {
  const { className, onClick, children } = props

  return (
    <button
      className={`font-semibold ease-in-out duration-250 transition-all cursor-pointer px-5 py-2 rounded-${props.rounded ?? "lg"} ${getClassesForType(
        props.type ?? 'primary'
      )} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
