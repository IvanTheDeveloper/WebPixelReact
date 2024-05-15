export class Comment {
    id: string | null
    authorId: string
    message: string
    votes: number
    uidsUpvoted: string[]
    uidsDownvoted: string[]
    reports: number
    uidsReported: string[]
    isEdited: boolean
    editedAt: number     //timestamp
    createdAt: number    //timestamp

    constructor(
        id: string | null = null,
        authorId: string,
        message: string = '',
        votes: number = 0,
        uidsUpvoted: string[] = [''],
        uidsDownvoted: string[] = [''],
        reports: number = 0,
        uidsReported: string[] = [''],
        isEdited: boolean = false,
        editedAt: number = Date.now(),
        createdAt: number = Date.now(),
    ) {
        this.id = id
        this.authorId = authorId
        this.message = message
        this.votes = votes
        this.uidsUpvoted = uidsUpvoted
        this.uidsDownvoted = uidsDownvoted
        this.reports = reports
        this.uidsReported = uidsReported
        this.isEdited = isEdited
        this.editedAt = editedAt
        this.createdAt = createdAt
    }

}
