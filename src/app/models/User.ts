type Hash = string
export class MyUser {
    //data
    id?: string | null
    email?: string | null
    password?: Hash | null
    username?: string | null
    phone?: string | null
    address?: string | null
    //images
    avatarUrl?: string | null
    cursorUrl?: string | null
    //roles
    isAdmin?: boolean
    isMod?: boolean
    //timestamps
    lastLoginAt?: number
    createdAt?: number

    [key: string]: any

    constructor(data: Partial<MyUser> = {}) {
        if (data.id) this.id = data.id;
        if (data.email) this.email = data.email;
        if (data.password) this.password = data.password;
        if (data.username) this.username = data.username;
        if (data.phone) this.phone = data.phone;
        if (data.address) this.address = data.address;
        if (data.avatarUrl) this.avatarUrl = data.avatarUrl;
        if (data.cursorUrl) this.cursorUrl = data.cursorUrl;
        if (data.isAdmin) this.isAdmin = data.isAdmin;
        if (data.isMod) this.isMod = data.isMod;
        if (data.lastLoginAt) this.lastLoginAt = data.lastLoginAt;
        if (data.createdAt) this.createdAt = data.createdAt;
    }

    static createWithDefaults(
        {
            id = null,
            email = null,
            password: password = null,
            username = null,
            phone = null,
            address = null,
            avatarUrl = null,
            cursorUrl = null,
            isAdmin = false,
            isMod = false,
            lastLoginAt = Date.now(),
            createdAt = Date.now()
        }: Partial<MyUser> = {}
    ) {
        const user = new MyUser()
        user.id = id
        user.email = email
        user.password = password
        user.username = username
        user.phone = phone
        user.address = address
        user.avatarUrl = avatarUrl
        user.cursorUrl = cursorUrl
        user.isAdmin = isAdmin
        user.isMod = isMod
        user.lastLoginAt = lastLoginAt
        user.createdAt = createdAt
        return user
    }


    static createFromAuthUser(user: any): MyUser {
        return new MyUser({
            id: user.uid, //
            email: user.email,
            phone: user.phoneNumber,
            username: user.displayName,
            avatarUrl: user.photoURL,
        })
    }

    static createFromAuthUserWithDefaults(user: any): MyUser {
        return MyUser.createWithDefaults({
            id: user.uid, //
            email: user.email,
            phone: user.phoneNumber,
            username: user.displayName,
            avatarUrl: user.photoURL,
        })
    }

}
