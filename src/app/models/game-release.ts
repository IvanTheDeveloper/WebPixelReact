export class GameRelease {
    id: string
    platform: string
    architecture: string
    language: string
    changelog: string
    fileUrl: string | null
    downloads: number
    publishedAt: number

    constructor(
        id: string,
        platform: string,
        architecture: string = 'x64',
        language: string = 'en-US',
        changelog: string = '',
        fileUrl: string | null = null,
        downloads: number = 0,
        publishedAt: number = Date.now(),
    ) {
        this.id = id
        this.platform = platform
        this.architecture = architecture
        this.language = language
        this.changelog = changelog
        this.fileUrl = fileUrl
        this.downloads = downloads
        this.publishedAt = publishedAt
    }

}
