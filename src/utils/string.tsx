export function capitalize(str: string) {
    return str.split(' ').map((val: string) =>
        val.charAt(0).toUpperCase() + val.slice(1)
    ).join(' ')
}

