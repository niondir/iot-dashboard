


export function valuesOf(obj) {
    return Object.keys(obj).map(key => obj[key])
}