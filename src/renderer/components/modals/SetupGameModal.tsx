import { RefObject, useEffect, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { GameInformation } from '@preload/types/game'
import { setupGame } from '../../api/game'
import { ERROR_MESSAGES } from '../../util/error'

type Props = {
    open: boolean
    onChangeOpen: (open: boolean) => void
    game: GameInformation | null
    inputRef: RefObject<HTMLInputElement>
    onClickCancel?: () => void
    onSetupSuccess?: () => void
}

export default function SetupGameModal(props: Props) {
    const [lastOpenState, setLastState] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onClickSetupConfirm = () => {
        if (props.inputRef.current === null) {
            console.log('Input Reference is null. This should not happen!')
            return
        }

        setupGame(props.game.id, props.inputRef.current.value).then((result: { success: boolean; reason?: string }) => {
            if (result.success) {
                if (props.onSetupSuccess) props.onSetupSuccess()
            } else {
                setError(ERROR_MESSAGES.get(result.reason ?? '') ?? 'Unknown error.')
            }
        })
    }

    const onClickChange = () => {
        // pickFileDialog({ properties: ['openDirectory', 'dontAddToRecent'] }).then((result: OpenDialogReturnValue) => {
        //     if (result.canceled) {
        //         return
        //     }
        //
        //     const path = result.filePaths[0]
        //     if (props.inputRef.current) {
        //         props.inputRef.current.value = path
        //     }
        // })
    }

    /*
     * Reset the error message when the Modal is being opened.
     * Could also implement this behavior when closing, but nah.
     */
    useEffect(() => {
        if (!lastOpenState && props.open) {
            setError(null)
        }

        setLastState(props.open)
    }, [props.open])

    return (
        <Modal
            open={props.open}
            onChangeOpen={props.onChangeOpen}
            classNames={{
                childrenWrapper: 'w-128'
            }}
        >
            <div className="flex flex-col gap-4 w-full h-full">
                <h1 className="text-lg select-none">Select game installation</h1>
                <Input
                    classNames={{
                        wrapper: 'flex'
                    }}
                    ref={props.inputRef}
                    placeholder="C:\Program Files"
                >
                    <div className="absolute top-0 right-4 h-full flex items-center select-none">
                        <p
                            className="text-sm text-primary-600 hover:brightness-[115%] transition-color duration-200 ease-in-out cursor-pointer"
                            onClick={onClickChange}
                        >
                            Change
                        </p>
                    </div>
                </Input>
                <p
                    className={`text-red-500 ${
                        error === null ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                    }`}
                >
                    Error: {error}
                </p>
                <div className="mt-auto flex ml-auto gap-4 select-none">
                    <Button type="secondary" onClick={props.onClickCancel}>
                        Cancel
                    </Button>
                    <Button onClick={() => onClickSetupConfirm()}>Confirm</Button>
                </div>
            </div>
        </Modal>
    )
}
