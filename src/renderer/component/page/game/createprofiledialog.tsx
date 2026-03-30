import { Select } from "@base-ui/react";
import { ProfileDTO } from "@common/dto/profile";
import Button from "@renderer/component/ui/button";
import { Dialog } from "@renderer/component/ui/dialog";
import { Input } from "@renderer/component/ui/input";
import { invokeIpc } from "@renderer/ipc";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useRef } from "react";

interface Loader
{
    value: string;
    label: string;
}

interface Props
{
    gameId: string;
    open: boolean;
    setOpen: (state: boolean) => void;
    onCreate?: (profile: ProfileDTO) => void;
    loaders: Loader[];
}

export function CreateProfileDialog(props: Props)
{
    const nameRef = useRef<HTMLInputElement>(null);

    const onClickCreate = () =>
    {
        if (nameRef.current === null)
        {
            return;
        }

        invokeIpc("game.profile.create", {
            gameId: props.gameId,
            name: nameRef.current.value,
            modLoaderId: ""
        }).then((result) =>
        {
            if (result !== null)
            {
                props.setOpen(false);
                props.onCreate?.(result);
            }
        });
    };

    return (
        <Dialog open={props.open} setOpen={props.setOpen}>
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">Create Profile</Dialog.Title>
            <Dialog.Description className="mt-6 flex flex-col gap-8">
                <Input placeholder="Name" ref={nameRef} />
                <div>
                    <Select.Root>
                        <Select.Label className="cursor-default text-sm leading-5 font-medium text-text">
                            Mod Loader
                        </Select.Label>
                        <Select.Trigger className="flex h-10 min-w-56 items-center justify-between gap-3 border border-border pr-3 pl-3.5 text-base bg-background-800 text-text select-none hover:bg-background-700 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:bg-background-700">
                            <Select.Value className="data-placeholder:opacity-60">
                                {(v: any) => props.loaders.find((l) => l.value === v)?.label ?? "Unknown"}
                            </Select.Value>
                            <Select.Icon className="flex">
                                <ChevronsUpDown />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Positioner
                                className="outline-hidden z-10"
                                sideOffset={8}
                                alignItemWithTrigger={false}
                            >
                                <Select.Popup className="group max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) bg-clip-padding overflow-y-auto bg-[canvas] py-1 text-text shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
                                    {props.loaders.map((value) => (
                                        <Select.Item
                                            key={value.value}
                                            value={value.value}
                                            className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-hidden select-none scroll-my-1 group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem] [@media(hover:hover)]:[&[data-highlighted]]:relative [@media(hover:hover)]:[&[data-highlighted]]:z-0 [@media(hover:hover)]:[&[data-highlighted]]:text-gray-50 [@media(hover:hover)]:[&[data-highlighted]]:before:content-[''] [@media(hover:hover)]:[&[data-highlighted]]:before:absolute [@media(hover:hover)]:[&[data-highlighted]]:before:inset-y-0 [@media(hover:hover)]:[&[data-highlighted]]:before:inset-x-1 [@media(hover:hover)]:[&[data-highlighted]]:before:rounded-xs [@media(hover:hover)]:[&[data-highlighted]]:before:bg-gray-900 [@media(hover:hover)]:[&[data-highlighted]]:before:z-[-1]"
                                        >
                                            <Select.ItemIndicator className="col-start-1">
                                                <CheckIcon className="size-3" />
                                            </Select.ItemIndicator>
                                            <Select.ItemText className="col-start-2">{value.label}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Popup>
                            </Select.Positioner>
                        </Select.Portal>
                    </Select.Root>
                </div>
                <Button onClick={onClickCreate}>Create</Button>
            </Dialog.Description>
        </Dialog>
    );
}
