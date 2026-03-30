import { ProfileDTO } from "@common/dto/profile";
import { ResourcesUtil } from "@renderer/util/resources";

interface Props
{
    profile: ProfileDTO;
}

export function ProfileCard(props: Props)
{
    return (
        <div className="flex gap-4 w-full p-4 bg-background-900/70 border border-border drop-shadow-lg drop-shadow-black">
            <img
                className="h-12"
                src={ResourcesUtil.linkGameAsset("ZENLESS_ZONE_ZERO", "048617ceb68b40a45847078db347ba59.png")}
                alt={"test"}
            />
            <div>
                <h3 className="text-lg font-semibold">{props.profile.name}</h3>
            </div>
        </div>
    );
}
