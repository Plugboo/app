import { Eye, Heart, MessageCircle } from 'lucide-react'
import React from 'react'
import { Mod } from '@common/types/service'

type Props = {
    mod: Mod
}

export default function ModStats(props: Props) {
    const { mod } = props

    return <div className="flex gap-4">
        <div className="flex gap-1 items-center">
            <Heart className="w-4 h-4 text-red-400" />
            <p className="text-background-500 font-medium">{mod.likes}</p>
        </div>
        <div className="flex gap-1 items-center">
            <MessageCircle className="w-4 h-4 text-primary-400" />
            <p className="text-background-500 font-medium">{mod.comments}</p>
        </div>
        <div className="flex gap-1 items-center">
            <Eye className="w-4 h-4 text-secondary-200 mb-0.25" />
            <p className="text-background-500 font-medium mt-0.25">{mod.views}</p>
        </div>
    </div>
}