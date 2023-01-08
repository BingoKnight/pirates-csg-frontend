import { BehaviorSubject } from 'rxjs'

export const isEditing$ = new BehaviorSubject<boolean>(false)

export const stagedCollectionAdds$ = new BehaviorSubject<string[]>([])
export const stagedCollectionRemoves$ = new BehaviorSubject<string[]>([])

export function toggleIsEditing() {
    isEditing$.next(!isEditing$.getValue())
}

export function setStagedCollectionAdds(itemIds: string[]) {
    stagedCollectionAdds$.next(itemIds)
}

export function setStagedCollectionRemoves(itemIds: string[]) {
    stagedCollectionRemoves$.next(itemIds)
}

