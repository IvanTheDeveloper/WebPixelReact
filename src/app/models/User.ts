export class User {
    id?: string | null
    email?: string
    password?: string    //hash
    username?: string
    phone?: string
    address?: string
    avatarUrl?: string
    cursorUrl?: string
    isAdmin?: boolean
    isMod?: boolean
    lastLoginAt?: number  //timestamp
    createdAt?: number    //timestamp

    constructor(
        {
            id = null,
            email = '',
            password = '',
            username = '',
            phone = '',
            address = '',
            avatarUrl = '',
            cursorUrl = '',
            isAdmin = false,
            isMod = false,
            lastLoginAt = Date.now(),
            createdAt = Date.now()
        }: Partial<User> = {}
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.phone = phone;
        this.address = address;
        this.avatarUrl = avatarUrl;
        this.cursorUrl = cursorUrl;
        this.isAdmin = isAdmin;
        this.isMod = isMod;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
    }
}
