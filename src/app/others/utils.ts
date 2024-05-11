export function isNullOrEmpty(s: string): boolean {
    return (s == null || s == undefined || s == '')
}

export function dd(obj: any) {
    alert('obj: ' + JSON.stringify(obj))
}