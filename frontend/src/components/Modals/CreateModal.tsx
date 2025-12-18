import { modalTitles } from "@//Constants/Constants";
import { useAppDispatch, useAppSelector } from "@//Hooks/stateHooks";
import { hideModal } from "@//reducers/createModalReducers";
import { useState } from "react";
import ModalContainer from "./ModalContainer";
import ErrorMessage from "../Misc/ErrorMessage";
import Loader from "../Misc/Loader";

type createModal = {
    show: boolean;
    children: React.ReactNode;
    isLoading: boolean;
    createFunction: () => Promise<void>;
};

function CreateModal({ children, show, createFunction, isLoading }: createModal) {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const [error, setError] = useState<string[]>([]);

    const handleClosing = () => {
        setError([]);
        dispatch(hideModal());
    };

    if (show === false) {
        return null;
    }

    const currentModal = Object.keys(createModalState).find(
        (k) => createModalState[k as keyof typeof createModalState]
    );

    const title: string = `Create ${modalTitles[currentModal as keyof typeof modalTitles]}`;

    const handleCreate = () => {
        createFunction()
            .then(() => handleClosing())
            .catch((error) => {
                setError(error as string[]);
            });
    };

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            <div className="relative">
                {isLoading && (
                    <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2">
                        <Loader />
                    </div>
                )}
                <div className={`${isLoading ? "invisible" : ""}`}>{children}</div>
            </div>
            <hr className="customDivider"></hr>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formBtn formBtnSecondary" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button className="formBtn formBtnPrimary" onClick={() => handleCreate()}>
                    <p>Create</p>
                </button>
            </div>
            <ErrorMessage error={error} />
        </ModalContainer>
    );
}

export default CreateModal;
