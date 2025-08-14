import { useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { AmountField, DateField, DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createIncomeDto } from "../types";
import { useCreateIncomeMutation } from "../api";

function CreateExpense() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date | string>(new Date());

    const createModalState = useAppSelector((state) => state.createModal.show);

    const [createIncome] = useCreateIncomeMutation();

    const createIncomeHandler = async () => {
        const errors: string[] = [];

        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const incomeData: createIncomeDto = {
            amount: amount,
            details: details,
            date: date,
        };

        await createIncome(incomeData)
            .unwrap()
            .catch(() => {
                throw [`Error creating income`];
            });
    };

    return (
        <CreateModal show={createModalState.income} createFunction={createIncomeHandler}>
            <AmountField fieldStateHandler={setAmount} />
            <DetailsField fieldStateHandler={setDetails} />
            <DateField fieldStateHandler={setDate} />
        </CreateModal>
    );
}

export default CreateExpense;
