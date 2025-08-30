import { useEffect, useState } from "react";
import { AmountField, DateField, DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { incomeDto, updateIncomeDto } from "../types";
import { useDeleteIncomeMutation, useUpdateIncomeMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";
import { validationError } from "@/types/types";

function DetailsExpense() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date | string>(new Date());

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const incomeData = detailsModalState.data as incomeDto;

    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    useEffect(() => {
        if (incomeData) {
            setAmount(incomeData.amount);
            setDetails(incomeData.details);
            setDate(incomeData.date);
        }
    }, [incomeData]);

    // Delete Income Function
    const deleteIncomeHandler = () => {
        const incomeId = incomeData.id;
        deleteIncome(incomeId!);
    };

    // Update Income Function
    const updateIncomeHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const newIncomeData: updateIncomeDto = {
            id: incomeData.id!,
            data: { amount: amount, details: details, date: date },
        };

        await updateIncome(newIncomeData)
            .unwrap()
            .catch((error) => {
                const validationError = error.data as validationError;
                if (validationError?.errors) {
                    throw Object.values(validationError.errors).flat();
                } else {
                    throw ["An unexpected error occurred. Please try again."];
                }
            });
    };

    return (
        <DetailsModal
            updateFunction={updateIncomeHandler}
            deleteFunction={deleteIncomeHandler}
            show={detailsModalState.show.income}
        >
            <AmountField value={amount} fieldStateHandler={setAmount} />
            <DetailsField value={details} fieldStateHandler={setDetails} />
            <DateField value={date} fieldStateHandler={setDate} />
        </DetailsModal>
    );
}

export default DetailsExpense;
