import React from "react";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "@//Hooks/stateHooks";
import { hideModal } from "@//reducers/detailsModalReducers";
import { modalTitles } from "@//Constants/Constants";
import { useState } from "react";
import ErrorMessage from "../Misc/ErrorMessage";
import Loader from "../Misc/Loader";

type detailsModal = {
    deleteFunction: () => Promise<void>;
    updateFunction: () => Promise<void>;
    isLoading: boolean;
    show: boolean;
    children: React.ReactNode;
};

function DetailsModal({ children, show, deleteFunction, updateFunction, isLoading }: detailsModal) {
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
        deleteFunction()
            .then(() => handleClosing())
            .catch((error) => {
                setError(error);
            });
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
