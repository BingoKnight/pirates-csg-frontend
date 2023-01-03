export interface CsgItem {
    _id: string
    id: string
    image: string
    faction: string
    rarity: string
    type: string
    name: string
    pointCost: number
    masts: number
    cargo: number
    baseMove: string
    cannons: string
    link: string | null
    ability: string | null
    flavorText: string | null
    teasureValues: [number] | null
    owned: number | undefined
}

