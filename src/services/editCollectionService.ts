import { BehaviorSubject } from 'rxjs'

export const isEditing$ = new BehaviorSubject<boolean>(false)

export function toggleIsEditing() {
    isEditing$.next(!isEditing$.getValue())
}

