import React from "react";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideModal } from "../../reducers/detailsModalReducers";

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

    const handleDelete = () => {
        deleteFunction();
        handleClosing();
    };

    const handleUpdate = () => {
        updateFunction();
        handleClosing();
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
        case "fixedExpense":
            title = "Fixed Expense Details";
            break;
        case "savingGoal":
            title = "Saving Goal Details";
            break;
        case "goalContribution":
            title = "Goal Contribution Details";
            break;
        case "expenseCategory":
            title = "Expense Category Details";
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
                <button className="formButton hover:bg-red-500" onClick={() => handleDelete()}>
                    <p>Delete</p>
                </button>
                <button className="formButton" onClick={() => handleUpdate()}>
                    <p>Save</p>
                </button>
            </div>
        </ModalContainer>
    );
}

export default DetailsModal;
