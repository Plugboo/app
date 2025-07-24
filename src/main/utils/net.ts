import fs from 'node:fs'
import fetch from 'node-fetch'

/**
 * Downloads a file from the specified URL and saves it to the given file path.
 *
 * @param url - The URL of the file to be downloaded.
 * @param filePath - The file path where the downloaded file will be saved.
 * @return Returns a promise that resolves to true if the download is successful, or false if an error occurs.
 */
export async function downloadFile(url: string, filePath: string): Promise<boolean> {
    try {
        const res = await fetch(url)
        const fileStream = fs.createWriteStream(filePath)
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream)
            res.body.on('error', reject)
            fileStream.on('finish', () => resolve(null))
        })
        return true
    } catch {
        return false
    }
}
