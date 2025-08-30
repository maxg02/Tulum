import { useEffect, useState } from "react";
import { AmountField, DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { savingGoalDto, updateSavingGoalDto } from "../types";
import { useDeleteSavingGoalMutation, useUpdateSavingGoalMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";
import { validationError } from "@/types/types";

function DetailsGoal() {
    const [details, setDetails] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const goalData = detailsModalState.data as savingGoalDto;

    const [deleteSavingGoal] = useDeleteSavingGoalMutation();
    const [updateSavingGoal] = useUpdateSavingGoalMutation();

    useEffect(() => {
        if (goalData) {
            setDetails(goalData.details);
            setAmount(goalData.goal);
        }
    }, [goalData]);

    const updateSavingGoalHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const savingGoalData: updateSavingGoalDto = {
            id: goalData.id!,
            data: {
                goal: amount,
                details: details,
            },
        };

        await updateSavingGoal(savingGoalData)
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

    const deleteSavingGoalHandler = () => {
        const savingGoalId = goalData.id;
        deleteSavingGoal(savingGoalId!);
    };

    return (
        <DetailsModal
            updateFunction={updateSavingGoalHandler}
            deleteFunction={deleteSavingGoalHandler}
            show={detailsModalState.show.savingGoal}
        >
            <DetailsField value={details} fieldStateHandler={setDetails} />
            <AmountField value={amount} fieldStateHandler={setAmount} />
        </DetailsModal>
    );
}

export default DetailsGoal;
