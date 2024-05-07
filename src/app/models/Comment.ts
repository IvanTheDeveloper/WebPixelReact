export class Comment {
    userId: string
    message: string
    votes: number
    date: Date

    constructor(userId: string, message: string, votes: number, date: Date) {
        this.userId = userId
        this.message = message
        this.votes = votes
        this.date = date
    }

}