export interface LoaderVersion {
    version: string
    devFile: LoaderFile
    playFile: LoaderFile
}

export interface LoaderFile {
    name: string
    url: string
}

export interface LoaderInstance {
    id: string
    version: LoaderVersion
}

export interface LoaderRData {
    id: string
    name: string
    versions: LoaderVersion[]
}