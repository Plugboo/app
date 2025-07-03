import { useState } from 'react'

interface DropdownValue {
  value: string
  label: string
}

type Props = {
  prefix?: string
  classNames?: {
    wrapper?: string
    option?: string
  }
  values: DropdownValue[]
  defaultValue?: string
  onSelect?: (value: string) => void
}

export default function Dropdown(props: Props) {
  const [value, setValue] = useState<DropdownValue>(props.defaultValue ? props.values.find((v) => v.value === props.defaultValue) ?? props.values[0] : props.values[0])
  const [open, setOpen] = useState(false)

  const onClickOption = (value: DropdownValue) => {
    setValue(value)
    if (props.onSelect) {
      props.onSelect(value.value)
    }
    setOpen(false)
  }

  return <div className="relative flex flex-col">
    <div
      className={`${props.classNames ? props.classNames.wrapper ?? '' : ''} w-full bg-background-800 z-20 px-3 py-1.5 rounded-lg cursor-pointer`}
      onClick={() => setOpen(!open)}>
      <p>{`${props.prefix ?? ''}${value.label}`}</p>
    </div>
    <div
      className={`absolute top-10 w-full z-10 flex flex-col bg-background-800 rounded-lg transition-all duration-150 ease-in-out drop-shadow-lg overflow-hidden ${open ? 'pointer-events-auto opacity-100 z-100' : 'pointer-events-none opacity-0 z-10'}`}>
      {props.values.map((value) => (
        <div
          className={`${props.classNames ? props.classNames.option ?? '' : ''} text-text-400 cursor-pointer hover:bg-background-900/30 px-3 py-1.5`}
          key={value.value}
          onClick={() => onClickOption(value)}>
          {value.label}
        </div>
      ))}
    </div>
  </div>
}