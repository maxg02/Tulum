import React from "react";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "@//Hooks/stateHooks";
import { hideModal } from "@//reducers/detailsModalReducers";
import { modalTitles } from "@//Constants/Constants";
import { useState } from "react";
import ErrorMessage from "../Misc/ErrorMessage";

type detailsModal = {
    deleteFunction: () => void;
    updateFunction: () => Promise<void>;
    show: boolean;
    children: React.ReactNode;
};

function DetailsModal({ children, show, deleteFunction, updateFunction }: detailsModal) {
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string[]>([]);
    const detailsModalState = useAppSelector((state) => state.detailsModal.show);

    if (!show) {
        return null;
    }

    const handleClosing = () => {
        setError([]);
        dispatch(hideModal());
    };

    const handleDelete = () => {
        deleteFunction();
        handleClosing();
    };

    const handleUpdate = () => {
        updateFunction()
            .then(() => handleClosing())
            .catch((error) => {
                setError(error);
            });
    };

    const currentModal = Object.keys(detailsModalState).find(
        (k) => detailsModalState[k as keyof typeof detailsModalState]
    )!;

    const title: string = `${modalTitles[currentModal as keyof typeof modalTitles]} Details`;

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            <hr className="customDivider"></hr>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formBtn formBtnSecondary" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button className="formBtn formBtnDestroy" onClick={() => handleDelete()}>
                    <p>Delete</p>
                </button>
                <button className="formBtn formBtnPrimary" onClick={() => handleUpdate()}>
                    <p>Save</p>
                </button>
            </div>
            <ErrorMessage error={error} />
        </ModalContainer>
    );
}

export default DetailsModal;
