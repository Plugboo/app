import { ChangeEventHandler, KeyboardEventHandler, ReactNode, RefObject } from 'react'

type Props = {
    ref?: RefObject<HTMLInputElement>
    classNames?: {
        wrapper?: string
        input?: string
    }
    placeholder?: string
    children?: ReactNode | ReactNode[] | undefined
    value?: string | undefined
    onChange?: ChangeEventHandler<HTMLInputElement>
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

export default function Input(props: Props) {
    return (
        <div className={`relative ${props.classNames ? props.classNames.wrapper ?? '' : ''}`}>
            <input
                ref={props.ref}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                className={`w-full h-full outline-2 outline-primary-500/0 focus:outline-primary-500 transition-color duration-150 ease-in-out bg-background-700/50 px-4 py-3 rounded-lg ${
                    props.classNames ? props.classNames.input ?? '' : ''
                }`}
                placeholder={props.placeholder}
            />
            {props.children}
        </div>
    )
}
