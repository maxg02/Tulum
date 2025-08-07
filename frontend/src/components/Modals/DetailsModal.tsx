import React from "react";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideModal } from "../../reducers/detailsModalReducers";
import { modalTitles } from "../../Constants/Constants";
import { useState } from "react";

type detailsModal = {
    deleteFunction: () => void;
    updateFunction: () => Promise<void>;
    show: boolean;
    children: React.ReactNode;
};

function DetailsModal({ children, show, deleteFunction, updateFunction }: detailsModal) {
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string | null>(null);
    const detailsModalState = useAppSelector((state) => state.detailsModal.show);

    if (!show) {
        return null;
    }

    const handleClosing = () => {
        setError(null);
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
                setError(error.message);
            });
    };

    const currentModal = Object.keys(detailsModalState).find(
        (k) => detailsModalState[k as keyof typeof detailsModalState]
    )!;

    const title: string = `${modalTitles[currentModal as keyof typeof modalTitles]} Details`;

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            {error && (
                <div role="alert">
                    {error.split(",").map((e, key) => (
                        <p key={key} className="text-red-400 mb-0">
                            {e}
                        </p>
                    ))}
                </div>
            )}
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
        </ModalContainer>
    );
}

export default DetailsModal;
