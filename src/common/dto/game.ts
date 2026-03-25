export interface GamePropertiesDTO
{
    id: string;
    name: string;
    executableFile: string;
    requiredFiles: ReadonlyArray<string>;
}
