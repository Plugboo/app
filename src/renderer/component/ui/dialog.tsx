import { Dialog as BaseDialog } from "@base-ui/react";
import { ReactNode } from "react";

export interface DialogProps
{
    children?: ReactNode | ReactNode[];
    open?: boolean;
    setOpen?: (state: boolean) => void;
}

export function Dialog(props: DialogProps)
{
    return (
        <BaseDialog.Root open={props.open} onOpenChange={props.setOpen}>
            <BaseDialog.Portal>
                <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-xs opacity-85 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
                <BaseDialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 bg-background-900 p-6 text-text border-1 border-border transition-all duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                    {props.children}
                </BaseDialog.Popup>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
}

export namespace Dialog
{
    export const Title = BaseDialog.Title;
    export const Description = BaseDialog.Description;
}
