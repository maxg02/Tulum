import { useEffect, useState } from "react";
import { AmountField, ListField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { budgetPlanDto, updateBudgetPlanDto } from "../types";
import { useDeleteBudgetPlanMutation, useUpdateBudgetPlanMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";
import { periodicityValues } from "@/Constants/Constants";

type modalProps = {
    categories:
        | {
              id: number;
              value: string;
          }[]
        | undefined;
};

function DetailsBudget({ categories }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number>(0);
    const [periodicity, setPeriodicity] = useState<number | undefined>(undefined);

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const budgetData = detailsModalState.data as budgetPlanDto;

    const [deleteBudgetPlan] = useDeleteBudgetPlanMutation();
    const [updateBudgetPlan] = useUpdateBudgetPlanMutation();

    useEffect(() => {
        if (budgetData) {
            setAmount(budgetData.amount);
            setPeriodicity(budgetData.periodicity);
            setSelectValue(budgetData.expenseCategoryId);
        }
    }, [budgetData]);

    const updateBudgetPlanHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (periodicity === undefined) errors.push("Periodicity must be selected");

        if (errors.length > 0) {
            throw errors;
        }

        const budgetPlanData: updateBudgetPlanDto = {
            id: budgetData.id!,
            data: { amount: amount, periodicity: periodicity! },
        };

        await updateBudgetPlan(budgetPlanData)
            .unwrap()
            .catch(() => {
                throw [`Error updating budget`];
            });
    };

    const deleteBudgetPlanHandler = () => {
        const budgetPlanId = budgetData.id;
        deleteBudgetPlan(budgetPlanId!);
    };

    return (
        <DetailsModal
            updateFunction={updateBudgetPlanHandler}
            deleteFunction={deleteBudgetPlanHandler}
            show={detailsModalState.show.budgetPlanning}
        >
            <AmountField value={amount} fieldStateHandler={setAmount} />
            <SelectField<number>
                value={selectValue}
                fieldStateHandler={setSelectValue}
                label="Category"
                options={categories}
                disabled
            />
            <ListField
                fieldStateHandler={setPeriodicity}
                label="Periodicity"
                options={periodicityValues}
                value={periodicity}
            />
        </DetailsModal>
    );
}

export default DetailsBudget;
