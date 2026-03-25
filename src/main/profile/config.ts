import { err, ok, Result } from "neverthrow";
import { Profile } from "@main/profile/index";

export namespace ProfileConfig
{
    type TypeOfTypes = "string" | "number" | "boolean";
    type ValueType = TypeOfTypes | null;

    export const NEWEST_VERSION = 1;
    export const SUPPORTED_VERSIONS = [NEWEST_VERSION];

    /**
     * Returns an array of keys that have invalid values.
     */
    function getInvalidValues(data: any, values: { key: string; type: ValueType }[]): string[]
    {
        const invalidKeys: string[] = [];

        for (const { key, type } of values)
        {
            const value = data[key];

            if (value === undefined)
            {
                invalidKeys.push(key);
                continue;
            }

            if (type === null && value !== null)
            {
                invalidKeys.push(key);
                continue;
            }

            if (typeof type === "string" && typeof value !== type)
            {
                invalidKeys.push(key);
                continue;
            }
        }

        return invalidKeys;
    }

    /**
     * A unified data structure of the profile configuration.
     */
    export interface Data
    {
        version: number;
        name: string;
        game: string;
    }

    /**
     * Version 1 of the profile configuration file.
     */
    export class V1
    {
        public static parse(data: any): Result<ProfileConfig.Data, Error>
        {
            const invalidValues = getInvalidValues(data, [
                { key: "name", type: "string" },
                { key: "game", type: "string" }
            ]);

            if (invalidValues.length > 0)
            {
                return err(new Error(`Invalid values: ${invalidValues.join(", ")}`));
            }

            const { name, game } = data;

            return ok({
                version: 1,
                name: name,
                game: game
            });
        }

        public static create(profile: Profile): any
        {
            return {
                version: 1,
                name: profile.name,
                game: profile.gameId
            };
        }
    }

    /**
     * Parses the profile configuration into a unified data structure.
     */
    export function parse(data: any, version: number): Result<ProfileConfig.Data, Error>
    {
        switch (version)
        {
            case 1:
                return V1.parse(data);
            default:
                return err(new Error(`Unsupported version: ${version}`));
        }
    }

    /**
     * Creates the data structure of a profile configuration.
     */
    export function create(profile: Profile, version: number): any
    {
        switch (version)
        {
            case 1:
                return V1.create(profile);
            default:
                return {};
        }
    }
}
