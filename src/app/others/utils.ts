export function isNullOrEmpty(any: any): boolean {
    return (any == null || any == undefined || any == '')
}

export function dump(obj: any): void {
    const json = JSON.stringify(obj)
    alert('dumped: ' + json)
    console.log('dumped: ' + json)
}

export function getRandomHexColor(): string {
    const letters = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

export function generateRandomAvatar(name: string): string {
    name = encodeURIComponent(name)
    const color = getRandomHexColor()
    return `https://ui-avatars.com/api/?background=${color}&name=${name}`
    //return 'https://source.boringavatars.com'
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject("operation timed out"), timeoutMs)
    )
    return Promise.race([promise, timeout]);
}
