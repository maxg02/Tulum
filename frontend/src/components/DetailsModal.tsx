import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
    updateIncomeDto,
    useDeleteIncomeMutation,
    useGetIncomesByIdQuery,
    useUpdateIncomeMutation,
} from "../../api/apiSlice";
import Loader from "./Loader";
import ModalContainer from "./ModalContainer";
import { useAppDispatch, useAppSelector } from "../hooks";
import { hideModal } from "../reducers/detailsModalReducers";

type detailsModal = {
    deleteFunction: () => void;
    updateFunction: () => void;
    itemId: number;
    children: React.ReactNode;
};

function DetailsModal({ children, deleteFunction, updateFunction, itemId }: detailsModal) {
    const { data, error, isLoading } = useGetIncomesByIdQuery(1);
    const [deleteIncome, deleteResult] = useDeleteIncomeMutation();
    const [updateIncome, updateResult] = useUpdateIncomeMutation();

    const show = useAppSelector((state) => state.detailsModal.show);
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     if (!isLoading && data != undefined) {
    //         setAmount(data.amount), setDetail(data.details), setDate(data.date), setId(data.id);
    //     }
    // }, [isLoading, data]);

    if (!show) {
        return null;
    }

    const handleDeleteIncome = (e) => {
        e.preventDefault;
        deleteIncome(id);
        handleClosing();
    };

    const handleUpdateIncome = (e) => {
        e.preventDefault;

        const incomeData: updateIncomeDto = {
            id: itemId,
            data: { amount: amount, details: details, date: date },
        };
        updateIncome(incomeData);
        console.log(updateResult);
        handleClosing();
    };

    const handleClosing = () => dispatch(hideModal());

    return (
        <ModalContainer closingHandler={handleClosing}>
            {children}
            <span className="formDivider"></span>
            <div className="self-end flex gap-x-2">
                <button type="reset" className="formButton" onClick={handleClosing}>
                    <p>Cancel</p>
                </button>
                <button
                    className="formButton hover:bg-red-500"
                    onClick={(event) => handleDeleteIncome(event)}
                >
                    <p>Delete</p>
                </button>
                <button className="formButton" onClick={(event) => handleUpdateIncome(event)}>
                    <p>Save</p>
                </button>
            </div>
        </ModalContainer>
    );
}

export default DetailsModal;
