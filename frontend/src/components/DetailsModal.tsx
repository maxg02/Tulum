import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "../hooks";
import { hideModal } from "../reducers/detailsModalReducers";

type detailsModal = {
    deleteFunction: () => void;
    updateFunction: () => void;
    show: boolean;
    children: React.ReactNode;
};

function DetailsModal({ children, show, deleteFunction, updateFunction }: detailsModal) {
    const dispatch = useAppDispatch();
    const detailsModalState = useAppSelector((state) => state.detailsModal.show);

    if (!show) {
        return null;
    }

    const handleClosing = () => dispatch(hideModal());

    const handleDelete = (e) => {
        e.preventDefault;
        deleteFunction();
    };

    const handleUpdate = (e) => {
        e.preventDefault;
        updateFunction();
    };

    const currentModal = Object.keys(detailsModalState).filter((k) => detailsModalState[k]);

    let title: string = "";

    switch (currentModal[0]) {
        case "income":
            title = "Income Details";
            break;
        case "fixedIncome":
            title = "Fixed Income Details";
            break;
        case "budgetPlanning":
            title = "Budget Plan Details";
            break;
        case "expense":
            title = "Expense Details";
            break;
    }

    return (
        <ModalContainer closingHandler={handleClosing} title={title}>
            {children}
            <span className="formDivider"></span>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formButton" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button className="formButton hover:bg-red-500" onClick={(event) => handleDelete(event)}>
                    <p>Delete</p>
                </button>
                <button className="formButton" onClick={(event) => handleUpdate(event)}>
                    <p>Save</p>
                </button>
            </div>
        </ModalContainer>
    );
}

export default DetailsModal;
