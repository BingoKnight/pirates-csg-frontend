import { BehaviorSubject } from 'rxjs'
import { getKeywordsDictionary, getPiratesCsgList, getUser, getUserCollection } from '../api.js'
import { AbilityKeyword } from '../types/abilityKeyword.ts'
import { CsgItem } from '../types/csgItem.ts'
import { isLoggedIn } from '../utils/user.ts'

export const piratesCsgList$ = new BehaviorSubject<CsgItem[]>([])
export const user$ = new BehaviorSubject<Object | undefined>(undefined)
export const userCollection$ = new BehaviorSubject<CsgItem[]>([])
export const keywordsDictionary$ = new BehaviorSubject<AbilityKeyword[]>([])

export function refreshPiratesCsgList() {
    getPiratesCsgList()
        .then(piratesCsgList => {
            piratesCsgList$.next(
                piratesCsgList.filter((csgItem: CsgItem) => csgItem.ability || csgItem.set.toLowerCase() !== 'unreleased')
            )
        })
}

export function refreshUser() {
    if (isLoggedIn()) {
        getUser().then(user => user$.next(user))
        getUserCollection().then(userCollection => userCollection$.next(userCollection))
    }
}

export function refreshKeywordsDictionary() {
    getKeywordsDictionary().then(keywordsDictionary => keywordsDictionary$.next(keywordsDictionary))
}

