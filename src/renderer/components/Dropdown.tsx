interface DropdownValue {
  value: string
  label: string
}

type Props = {
  values: DropdownValue[]
  onSelect?: (value: string) => void
}

export default function Dropdown(props: Props) {
  return <select className="bg-background-700 px-3 py-1.5 rounded-lg" onChange={(e) => {
    if (props.onSelect) props.onSelect(e.target.value)
  }}>
    {props.values.map((value) => {
      return <option className="text-text-400" value={value.value} key={value.value}>{value.label}</option>
    })}
  </select>
}