import { useState } from 'react'
import Divider from './Divider'

type Props = {
    page: number
    maxPage: number
    onChangePage?: (page: number) => void
}

export default function Paginator(props: Props) {
    const { page, maxPage, onChangePage } = props

    const onClickButton = (newPage: number) => {
        if (newPage < 0) {
            newPage = 0
        } else if (newPage > maxPage) {
            newPage = maxPage
        }

        if (onChangePage) {
            onChangePage(newPage)
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

    if (maxPage === 0) {
        return null
    }

    return (
        <div className="flex gap-1.5 h-full">
            {page >= 3 && (
                <>
                    <PaginatorButton index={0} />
                    <Divider className="!w-3 my-auto" />
                </>
            )}

            {Array(Math.min(5, maxPage))
                .fill(null)
                .map((_, arrayIndex) => {
                    const index = arrayIndex + page - Math.min(page, 2) - (3 - Math.min(maxPage - page, 3))
                    return <PaginatorButton index={index} />
                })}

            {maxPage - page >= 4 && maxPage > 5 && (
                <>
                    <Divider className="!w-3 my-auto" />
                    <PaginatorButton index={maxPage - 1} />
                </>
            )}
        </div>
    )
}
