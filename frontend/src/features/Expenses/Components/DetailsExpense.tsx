import { useEffect, useState } from "react";
import { AmountField, DateField, DetailsField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { expenseDto, updateExpenseDto } from "../types";
import { useDeleteExpenseMutation, useUpdateExpenseMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";

type modalProps = {
    categories:
        | {
              id: number;
              value: string;
          }[]
        | undefined;
};

function DetailsExpense({ categories }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date | string>(new Date());
    const [selectValue, setSelectValue] = useState<number>(0);

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const expenseData = detailsModalState.data as expenseDto;

    useEffect(() => {
        if (expenseData) {
            setAmount(expenseData.amount);
            setDetails(expenseData.details);
            setDate(expenseData.date);
            setSelectValue(expenseData.expenseCategoryId);
        }
    }, [expenseData]);

    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    const updateExpenseHandler = async () => {
        const errors: string[] = [];
        if (!amount || amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (!details || details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");
        if (selectValue === 0) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw errors;
        }

        const newExpenseData: updateExpenseDto = {
            id: expenseData.id,
            data: {
                amount: amount,
                details: details,
                date: date,
                expenseCategoryId: selectValue === -1 ? null : selectValue,
            },
        };

        await updateExpense(newExpenseData)
            .unwrap()
            .catch(() => {
                throw [`Error updating expense`];
            });
    };

    const deleteExpenseHandler = () => {
        const expenseId = expenseData.id;
        deleteExpense(expenseId!);
    };

    return (
        <DetailsModal
            updateFunction={updateExpenseHandler}
            deleteFunction={deleteExpenseHandler}
            show={detailsModalState.show.expense}
        >
            <AmountField value={amount} fieldStateHandler={setAmount} />
            <DetailsField value={details} fieldStateHandler={setDetails} />
            <DateField value={date} fieldStateHandler={setDate} />
            <SelectField<number>
                value={selectValue}
                fieldStateHandler={setSelectValue}
                label="Category"
                options={categories}
            />
        </DetailsModal>
    );
}

export default DetailsExpense;
