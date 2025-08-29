import { useEffect, useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { AmountField, ListField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createBudgetPlanDto } from "../types";
import { useCreateBudgetPlanMutation } from "../api";
import { periodicityValues } from "@/Constants/Constants";
import { validationError } from "@/types/types";

type modalProps = {
    categories:
        | {
              id: number;
              value: string;
          }[]
        | undefined;
};

function CreateBudget({ categories }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number | undefined>(undefined);
    const [periodicity, setPeriodicity] = useState<number | undefined>(undefined);

    const createModalState = useAppSelector((state) => state.createModal.show.budgetPlanning);

    useEffect(() => {
        if (!createModalState) {
            setSelectValue(undefined);
        }
    }, [createModalState]);

    const [createBudgetPlan] = useCreateBudgetPlanMutation();

    const createBudgetHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (periodicity === undefined) errors.push("Periodicity must be selected");
        if (selectValue === 0 || selectValue === undefined) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw errors;
        }

        const budgetPlanData: createBudgetPlanDto = {
            amount: amount,
            expenseCategoryId: selectValue!,
            periodicity: periodicity!,
        };

        await createBudgetPlan(budgetPlanData)
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
        <CreateModal show={createModalState} createFunction={createBudgetHandler}>
            <AmountField fieldStateHandler={setAmount} />
            <SelectField<number | undefined>
                fieldStateHandler={setSelectValue}
                label="Category"
                options={categories}
                value={selectValue}
            />
            <ListField
                fieldStateHandler={setPeriodicity}
                label="Periodicity"
                options={periodicityValues}
                value={periodicity}
            />
        </CreateModal>
    );
}

export default CreateBudget;
