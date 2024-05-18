export function isNullOrEmpty(any: any): boolean {
    return (any == null || any == undefined || any == '')
}

export function dump(obj: any) {
    alert('dumped: ' + JSON.stringify(obj))
    console.log('dumped: ' + obj)
}

export function getRandomHexColor() {
    const letters = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}
