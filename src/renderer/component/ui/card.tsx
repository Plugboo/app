import { cn } from "@renderer/util/tailwind";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement>
{}

export function Card(props: Props)
{
    return (
        <div
            {...props}
            className={cn(
                "w-full p-4 bg-background-900/70 border border-border drop-shadow-lg drop-shadow-black",
                props.className
            )}
        />
    );
}

export function HighlightableCard(props: Props)
{
    return (
        <Card
            {...props}
            className={cn(
                "hover:bg-background-800/70 transition-transform duration-150",
                props.className
            )}
        />
    );
}


export function ClickableCard(props: Props)
{
    return (
        <HighlightableCard
            {...props}
            className={cn(
                "cursor-pointer hover:scale-101",
                props.className
            )}
        />
    );
}
