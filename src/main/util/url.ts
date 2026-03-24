/**
 * Utility class for working with URLs.
 */
export class URLUtils
{
    /**
     * Constructs a query string from the given parameters object.
     *
     * @param {Record<string, string>} params - An object containing key-value pairs to be converted into a query string.
     * @return {string} A query string composed of the encoded key-value pairs joined by an `&`.
     * @note Filters out pairs where the value is `undefined`.
     */
    public static createParams(params: Record<string, string>): string
    {
        return Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");
    }
}
