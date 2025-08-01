import dns from 'dns'

/**
 * Checks for an active internet connection by attempting to resolve a DNS lookup for google.com.
 * This function resolves to a boolean indicating whether an internet connection is detected.
 *
 * @return A promise that resolves to true if internet is available, otherwise false.
 */
export async function checkForInternet(): Promise<boolean> {
    return new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
            resolve(!err)
        })
    })
}
