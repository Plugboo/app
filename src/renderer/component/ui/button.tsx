import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@renderer/util/tailwind";

interface Props extends BaseButton.Props
{
    variant?: "default" | "ghost";
}

const VARIANT_STYLES: Record<Props["variant"], string> = {
    default: "bg-gray-50 border-gray-200 border text-gray-900",
    ghost: "bg-transparent text-white hover:text-gray-900"
};

export default function Button(props: Props)
{
    const variantStyle = VARIANT_STYLES[props.variant ?? "default"];

    return (
        <BaseButton
            className={cn(
                "flex items-center transition-colors duration-250 cursor-pointer justify-center h-10 px-3.5 m-0 outline-0 font-inherit text-base font-medium leading-6 select-none hover:data-disabled:bg-gray-50 hover:bg-gray-100 active:data-disabled:bg-gray-50 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] active:border-t-gray-300 active:data-disabled:shadow-none active:data-disabled:border-t-gray-200 focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1 data-disabled:text-gray-500",
                variantStyle
            )}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </BaseButton>
    );
}
