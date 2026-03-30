import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@renderer/util/tailwind";
import * as React from "react";

interface Props extends BaseButton.Props
{
    variant?: "primary" | "ghost";
}

const VARIANT_STYLES: Record<Props["variant"], string> = {
    primary: "bg-primary border-primary-400 border text-text hover:data-disabled:bg-primary-600 hover:bg-primary-400 active:data-disabled:bg-primary-600 active:bg-primary-300 data-disabled:text-text-300 data-disabled:bg-primary-600",
    ghost: "bg-transparent text-white hover:text-gray-900"
};

export default function Button(props: Props)
{
    const variantStyle = VARIANT_STYLES[props.variant ?? "primary"];

    return (
        <BaseButton
            className={cn(
                "flex items-center transition-colors duration-250 cursor-pointer justify-center h-10 px-3.5 m-0 outline-0 font-inherit text-base font-medium leading-6 select-none active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] active:data-disabled:shadow-none focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1",
                variantStyle
            )}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </BaseButton>
    );
}
