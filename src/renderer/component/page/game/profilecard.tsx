import { ProfileDTO } from "@common/dto/profile";
import { ClickableCard } from "@renderer/component/ui/card";
import { ResourcesUtil } from "@renderer/util/resources";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement>
{
    profile: ProfileDTO;
}

export function ProfileCard(props: Props)
{
    return (
        <ClickableCard className="flex gap-4" {...props}>
            <img
                className="h-12"
                src={ResourcesUtil.linkGameAsset("ZENLESS_ZONE_ZERO", "048617ceb68b40a45847078db347ba59.png")}
                alt={"test"}
            />
            <div>
                <h3 className="text-lg font-semibold">{props.profile.name}</h3>
            </div>
        </ClickableCard>
    );
}
