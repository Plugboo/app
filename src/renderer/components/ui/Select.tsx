import { useState } from 'react'

interface SelectValue {
    value: string
    label: string
}

type Props = {
    prefix?: string
    classNames?: {
        wrapper?: string
        option?: string
    }
    placeholder?: string
    values: SelectValue[]
    onSelect?: (value: string) => void
}

export default function Select(props: Props) {
    const placeholder = props.placeholder ?? ''

    const [value, setValue] = useState<SelectValue | null>(null)
    const [open, setOpen] = useState(false)

    const onClickOption = (value: SelectValue) => {
        setValue(value)
        if (props.onSelect) {
            props.onSelect(value.value)
        }
        setOpen(false)
    }

    return <div className="relative flex flex-col items-center">
        <div
            className={`${props.classNames ? props.classNames.wrapper ?? '' : ''} ${value === null ? "text-text-400" : ""} w-full h-9.5 bg-background-700/50 z-20 px-3 py-1.5 rounded-lg cursor-pointer`}
            onClick={() => setOpen(!open)}>
            <p>{`${props.prefix ?? ''}${value !== null ? value.label : placeholder}`}</p>
        </div>
        <div
            className={`absolute top-10 w-full z-10 flex flex-col bg-background-700 rounded-lg transition-all duration-150 ease-in-out drop-shadow-lg overflow-hidden ${open ? 'pointer-events-auto opacity-100 z-100' : 'pointer-events-none opacity-0 z-10'}`}>
            {props.values.map((val) => (
                <div
                    className={`${props.classNames ? props.classNames.option ?? '' : ''} ${val.value === (value ? value.value : "______ASDOJ") ? 'bg-primary-500 text-primary-100 hover:bg-primary-600' : 'text-text-400 hover:bg-background-900/30'} cursor-pointer px-3 py-1.5`}
                    key={val.value}
                    onClick={() => onClickOption(val)}>
                    {val.label}
                </div>
            ))}
        </div>
    </div>
}