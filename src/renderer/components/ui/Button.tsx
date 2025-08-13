import { MouseEventHandler, ReactNode } from 'react'

type Type = 'default' | 'primary' | 'secondary'

type Props = {
    className?: string
    rounded?: 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    children?: ReactNode | ReactNode[] | undefined
    type?: Type
    onClick?: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    isIconOnly?: boolean
}

function getClassesForType(type: Type): string {
    switch (type) {
        case 'primary':
            return 'bg-primary-400 hover:brightness-[90%] text-background-800'
        case 'secondary':
            return 'bg-secondary-600/60 hover:brightness-[115%] text-secondary-300'
        case 'default':
        default:
            return 'text-background-400 hover:brightness-[115%] hover:bg-background-700/60'
    }
}

export default function Button(props: Props) {
    const { className, onClick, children, disabled } = props

    return (
        <button
            className={`${className ?? ''} ${disabled ? '!brightness-75 cursor-not-allowed' : 'cursor-pointer'} font-medium ease-in-out duration-250 transition-all ${props.isIconOnly ? 'p-2' : 'px-5 py-2'} rounded-${props.rounded ?? 'lg'} ${getClassesForType(
                props.type ?? 'primary'
            )}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
