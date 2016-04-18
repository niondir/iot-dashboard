export function valuesOf(obj, keyField) {
    if (keyField) {
        return Object.keys(obj).map(key => {
            return {...obj[key], [keyField]: key}
        })
    }
    return Object.keys(obj).map(key => obj[key])
}