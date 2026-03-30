import { HighlightableCard } from "@renderer/component/ui/card";
import { ResourcesUtil } from "@renderer/util/resources";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement>
{
    mod: {
        id: string;
        name: string;
        version: string;
        author: string;
    };
}

export function ModCard(props: Props)
{
    return (
        <HighlightableCard className="flex gap-4 items-center" {...props}>
            <img
                className="h-14"
                src={ResourcesUtil.linkGameAsset("ZENLESS_ZONE_ZERO", "048617ceb68b40a45847078db347ba59.png")}
                alt={"test"}
            />
            <div className="-space-y-1.5">
                <h3 className="text-lg font-semibold">{props.mod.name}</h3>
                <p className="text-sm font-normal brightness-70">by {props.mod.author}</p>
            </div>
        </HighlightableCard>
    );
}
