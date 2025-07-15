type Props = {
    className?: string
}

export default function Divider(props: Props) {
    return <hr className={`${props.className ?? ""} w-full bg-background-800 h-[2px] my-2 border-none`} />
}
