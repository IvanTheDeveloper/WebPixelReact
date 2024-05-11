export class Comment {
    id: string
    userId: string
    message: string
    votes: number
    date: Date

    constructor(id: string, userId: string, message: string, votes: number, date: Date) {
        this.id = id
        this.userId = userId
        this.message = message
        this.votes = votes
        this.date = date
    }

}