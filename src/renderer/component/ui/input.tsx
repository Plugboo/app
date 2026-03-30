import { Input as BaseInput, InputProps } from "@base-ui/react";

export function Input(props: InputProps)
{
    return (
        <BaseInput
            {...props}
            className="h-10 bg-background-800 border border-border pl-3.5 text-base text-text-100 focus:outline-2 focus:-outline-offset-1 focus:outline-primary-600"
        />
    );
}
