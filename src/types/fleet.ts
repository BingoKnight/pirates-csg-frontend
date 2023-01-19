import { CsgItem } from './csgItem.ts'

export interface PageData {
    next: string | null,
    prev: string | null,
    limit: number,
    total: number
}

export interface User {
    _id: string,
    username: string,
    email: string
}

export interface FleetShip {
    ship: CsgItem,
    attachments: CsgItem[]
}

export interface Fleet {
    _id: string,
    title: string,
    pointCost: number,
    user: User,
    ships: FleetShip[],
    forts: CsgItem[],
    events: CsgItem[],
    uniqueTreasure: CsgItem[],
    unassigned: CsgItem[]
}

export interface FleetResults {
    page: PageData,
    results: Fleet[]
}


