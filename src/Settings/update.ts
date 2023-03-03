import { emit, listen } from "@tauri-apps/api/event";
import { onUpdaterEvent, UpdateStatus } from "@tauri-apps/api/updater";
import { ProviderContext } from "notistack";
import { errorToast } from "../ts/toast";

export const update = async ({setAskUpdate, setUpdateState, toast}: {
    setAskUpdate ?: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdateState ?: (update: React.SetStateAction<UpdateStatus | "NONE">) => void
    toast : ProviderContext
}) => {
    setAskUpdate?.(false)
    listen('tauri://update-status', function (res) {
        console.log('New status: ', res)
    })
    const unlisten = await onUpdaterEvent(({ error, status }) => {
        console.log(status);
        if (status === "ERROR") {
            errorToast('Error updating', toast, error as string | Error)
            console.log("unlisten");
            unlisten();
        }
        if (status === "DONE") {
            console.log("unlisten");
            unlisten();
        }
        setUpdateState?.(status)
    });
    try {
        console.log("TRY install");
        emit('tauri://update-install')
    } catch (e) {
        console.error(e);
    }
}
