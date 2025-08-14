import { useEffect, useState } from "react";
import { AmountField, DateField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { goalContributionDto, updateGoalContributionDto } from "../types";
import { useDeleteGoalContributionMutation, useUpdateGoalContributionMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";

type modalProps = {
    goals: {
        id: number;
        value: string;
    }[];
};

function DetailsContribution({ goals }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<Date | string>(new Date());
    const [selectValue, setSelectValue] = useState<number>(0);

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const contributionData = detailsModalState.data as goalContributionDto;

    useEffect(() => {
        if (contributionData) {
            setAmount(contributionData.amount);
            setDate(contributionData.date);
            setSelectValue(contributionData.savingGoalId);
        }
    }, [contributionData]);

    const [deleteGoalContribution] = useDeleteGoalContributionMutation();
    const [updateGoalContribution] = useUpdateGoalContributionMutation();

    const updateGoalContributionHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (selectValue === 0) errors.push("Goal must be selected");
        if (date === null) errors.push("Date cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const goalContributionData: updateGoalContributionDto = {
            id: contributionData.id!,
            data: {
                amount: amount,
                date: date,
                savingGoalId: selectValue,
            },
        };

        await updateGoalContribution(goalContributionData)
            .unwrap()
            .catch(() => {
                throw [`Error updating goal contribution`];
            });
    };

    const deleteGoalContributionHandler = () => {
        const goalContributionId = contributionData.id;
        deleteGoalContribution(goalContributionId!);
    };

    return (
        <DetailsModal
            updateFunction={updateGoalContributionHandler}
            deleteFunction={deleteGoalContributionHandler}
            show={detailsModalState.show.goalContribution}
        >
            <AmountField value={amount} fieldStateHandler={setAmount} />
            <SelectField
                value={selectValue}
                fieldStateHandler={setSelectValue}
                label="Goal"
                options={goals}
            />
            <DateField value={date} fieldStateHandler={setDate} />
        </DetailsModal>
    );
}

export default DetailsContribution;
