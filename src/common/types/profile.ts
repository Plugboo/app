import { ModRData } from '@common/types/mod'

export interface ProfileRData {
    id: string
    gameId: string
    name: string
    mods: ModRData[]
}