export class User {
    id: string | null
    email: string
    password: string    //hash
    username: string
    phone: string
    address: string
    avatarUrl: string
    cursorUrl: string
    isAdmin: boolean
    isMod: boolean
    lastLoginAt: number  //timestamp
    createdAt: number    //timestamp

    constructor(
        id: string | null = null,
        email: string,
        password: string = '',
        username: string = '',
        phone: string = '',
        address: string = '',
        avatarUrl: string = '',
        cursorUrl: string = '',
        isAdmin: boolean = false,
        isMod: boolean = false,
        lastLoginAt: number = Date.now(),
        createdAt: number = Date.now()
    ) {
        this.id = id
        this.email = email
        this.password = password
        this.username = username
        this.phone = phone
        this.address = address
        this.avatarUrl = avatarUrl
        this.cursorUrl = cursorUrl
        this.isAdmin = isAdmin
        this.isMod = isMod
        this.lastLoginAt = lastLoginAt
        this.createdAt = createdAt
    }

}
