import { BehaviorSubject } from 'rxjs'
import {
    getFleetList,
    getKeywordsDictionary,
    getPiratesCsgList,
    getUrl,
    getUser,
    getUserCollection
} from '../api.js'
import { AbilityKeyword } from '../types/abilityKeyword.ts'
import { CsgItem } from '../types/csgItem.ts'
import { FleetResults } from '../types/fleet.ts'
import { isLoggedIn } from '../utils/user.ts'

export const piratesCsgList$ = new BehaviorSubject<CsgItem[]>([])
export const isCsgListFetchComplete$ = new BehaviorSubject<boolean>(true)

export const user$ = new BehaviorSubject<Object | undefined>(undefined)

export const userCollection$ = new BehaviorSubject<CsgItem[]>([])
export const isUserCollectionFetchComplete$ = new BehaviorSubject<boolean>(true)

export const fleetPagedList$ = new BehaviorSubject<FleetResults>([])
export const isFleetPagedListFetchComplete$ = new BehaviorSubject<boolean>(true)

export const keywordsDictionary$ = new BehaviorSubject<AbilityKeyword[]>([])

export function refreshPiratesCsgList() {
    isCsgListFetchComplete$.next(false)
    getPiratesCsgList()
        .then(piratesCsgList => {
            piratesCsgList$.next(
                piratesCsgList.filter((csgItem: CsgItem) => csgItem.ability || csgItem.set.toLowerCase() !== 'unreleased')
            )
            isCsgListFetchComplete$.next(true)
        })
}

export function refreshUser() {
    if (isLoggedIn()) {
        getUser().then(user => user$.next(user))
    }
}

export function refreshUserCollection() {
    if (isLoggedIn()) {
        isUserCollectionFetchComplete$.next(false)

        getUserCollection().then(userCollection => {
            userCollection$.next(userCollection)
            isUserCollectionFetchComplete$.next(true)
        })
    }
}

export function refreshKeywordsDictionary() {
    getKeywordsDictionary().then(keywordsDictionary => keywordsDictionary$.next(keywordsDictionary))
}

export function getFleetPage(pageNumber: number) {
    isFleetPagedListFetchComplete$.next(false)

    getFleetList(pageNumber)
        .then((fleetResults: FleetResults) => {
            fleetPagedList$.next(fleetResults.results)
            isFleetPagedListFetchComplete$.next(true)
        })
}

function getFleetPageUrl(url: string) {
    if (url) {
        getUrl(url).then((fleetResults: FleetResults) => {
            fleetPagedList$.next(fleetResults.results)
            isFleetPagedListFetchComplete$.next(true)
        })
    }

    getFleetList(1).then((fleetResults: FleetResults) => {
        fleetPagedList$.next(fleetResults)
        isFleetPagedListFetchComplete$.next(true)
    })
}

export function nextFleetPage() {
    isFleetPagedListFetchComplete$.next(false)

    getFleetPageUrl(fleetPagedList$.getValue().page?.next)
}

export function previousFleetPage() {
    isFleetPagedListFetchComplete$.next(false)

    getFleetPageUrl(fleetPagedList$.getValue().page?.previous)
}

