import { useState } from 'react'
import Divider from './Divider'

type Props = {
    maxPage: number
    onChangePage?: (page: number) => void
}

export default function Paginator(props: Props) {
    const [page, setPage] = useState(0)

    const onClickButton = (newPage: number) => {
        if (newPage < 0) {
            newPage = 0
        } else if (newPage > props.maxPage) {
            newPage = props.maxPage
        }

        setPage(newPage)

        if (props.onChangePage) {
            props.onChangePage(newPage)
        }
    }

    const PaginatorButton = ({ index }: { index: number }) => {
        const isCurrentPage = index === page
        return (
            <div
                className={`flex shrink-0 items-center justify-center p-2 w-9 h-9 rounded-full cursor-pointer font-semibold transition-color duration-150 ${isCurrentPage ? 'bg-primary-500 text-primary-900 hover:brightness-115' : 'hover:bg-background-800'}`}
                key={index}
                onClick={() => onClickButton(index)}
            >
                {index + 1}
            </div>
        )
    }

    return (
        <div className="flex gap-1.5 h-full">
            {page >= 3 && (
                <>
                    <PaginatorButton index={0} />
                    <Divider className="!w-3 my-auto" />
                </>
            )}

            {Array(Math.min(5, props.maxPage))
                .fill(null)
                .map((_, arrayIndex) => {
                    let index = arrayIndex + page - Math.min(page, 2) - (3 - Math.min(props.maxPage - page, 3))

                    return <PaginatorButton index={index} />
                })}

            {props.maxPage - page >= 4 && props.maxPage > 5 && (
                <>
                    <Divider className="!w-3 my-auto" />
                    <PaginatorButton index={props.maxPage - 1} />
                </>
            )}
        </div>
    )
}
