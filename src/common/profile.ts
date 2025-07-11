import { ModRData } from '@common/mod'

export interface ProfileRData {
    id: string
    gameId: string
    name: string
    mods: ModRData[]
}