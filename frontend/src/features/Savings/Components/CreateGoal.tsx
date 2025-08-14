import { useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { AmountField, DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createSavingGoalDto } from "../types";
import { useCreateSavingGoalMutation } from "../api";

function CreateGoal() {
    const [details, setDetails] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const createModalState = useAppSelector((state) => state.createModal.show);

    const [createSavingGoal] = useCreateSavingGoalMutation();

    // Create Saving Goal function
    const createSavingGoalHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const savingGoalData: createSavingGoalDto = {
            goal: amount,
            details: details,
        };

        await createSavingGoal(savingGoalData)
            .unwrap()
            .catch(() => {
                throw [`Error creating goal`];
            });
    };

    return (
        <CreateModal show={createModalState.savingGoal} createFunction={createSavingGoalHandler}>
            <DetailsField fieldStateHandler={setDetails} />
            <AmountField fieldStateHandler={setAmount} />
        </CreateModal>
    );
}

export default CreateGoal;
