import { Result, ResultAsync } from "neverthrow";

/**
 * Wraps a promise into a ResultAsync to handle errors gracefully.
 */
export async function safePromise<T>(promise: Promise<T>): Promise<Result<T, unknown>>
{
    return ResultAsync.fromPromise(promise, (e) => e);
}
