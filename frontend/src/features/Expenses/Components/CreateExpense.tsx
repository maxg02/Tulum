import { useEffect, useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { AmountField, DateField, DetailsField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createExpenseDto } from "../types";
import { useCreateExpenseMutation } from "../api";
import { validationError } from "@/types/types";

type modalProps = {
    categories:
        | {
              id: number;
              value: string;
          }[]
        | undefined;
};

function CreateExpense({ categories }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date | string>(new Date());
    const [selectValue, setSelectValue] = useState<number | undefined>(undefined);

    const createModalState = useAppSelector((state) => state.createModal.show.expense);

    useEffect(() => {
        if (!createModalState) {
            setSelectValue(undefined);
        }
    }, [createModalState]);

    const [createExpense] = useCreateExpenseMutation();

    const createExpenseHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");
        if (selectValue === 0 || selectValue === undefined) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw errors;
        }

        const expenseData: createExpenseDto = {
            amount: amount,
            details: details,
            date: date,
            expenseCategoryId: selectValue! === -1 ? null : selectValue!,
        };

        await createExpense(expenseData)
            .unwrap()
            .then(() => {
                setSelectValue(undefined);
            })
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
        <CreateModal show={createModalState} createFunction={createExpenseHandler}>
            <AmountField fieldStateHandler={setAmount} />
            <SelectField<number | undefined>
                fieldStateHandler={setSelectValue}
                label="Category"
                options={categories}
                value={selectValue}
            />
            <DetailsField fieldStateHandler={setDetails} />
            <DateField fieldStateHandler={setDate} />
        </CreateModal>
    );
}

export default CreateExpense;
