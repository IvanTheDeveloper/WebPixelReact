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

export function generateRandomAvatar(name: string | null = null): string {
    if (name) {
        name = encodeURIComponent(name)
        const color = getRandomHexColor()
        return `https://ui-avatars.com/api/?background=${color}&name=${name}`
    } else {
        return 'https://source.boringavatars.com'
    }
}

export function generateQrCode(text: string): string {
    text = encodeURIComponent(text)
    return `https://api.qrserver.com/v1/create-qr-code/?data=${text}`
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject("operation timed out"), timeoutMs)
    )
    return Promise.race([promise, timeout])
}

export async function delay(ms: number) {
    await new Promise(f => setTimeout(f, ms))
}

export function encryptDecrypt(data: string): string {
    const encryptionCodeWord = 'SiLeesEstoNosDebesPonerUn10'
    let modifiedData = ''
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ encryptionCodeWord.charCodeAt(i % encryptionCodeWord.length)
        modifiedData += String.fromCharCode(charCode)
    }
    return modifiedData
}

