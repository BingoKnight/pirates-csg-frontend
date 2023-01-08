import { BehaviorSubject } from 'rxjs'
import { getKeywordsDictionary, getPiratesCsgList, getUser, getUserCollection } from '../api.js'
import { AbilityKeyword } from '../types/abilityKeyword.ts'
import { CsgItem } from '../types/csgItem.ts'
import { isLoggedIn } from '../utils/user.ts'

export const piratesCsgList$ = new BehaviorSubject<CsgItem[]>([])
export const isCsgListFetchComplete$ = new BehaviorSubject<boolean>(true)

export const user$ = new BehaviorSubject<Object | undefined>(undefined)

export const userCollection$ = new BehaviorSubject<CsgItem[]>([])
export const isUserCollectionFetchComplete$ = new BehaviorSubject<boolean>(true)

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

