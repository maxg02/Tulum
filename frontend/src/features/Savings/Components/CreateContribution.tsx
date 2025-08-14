import { useEffect, useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { AmountField, DateField, SelectField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createGoalContributionDto } from "../types";
import { useCreateGoalContributionMutation } from "../api";

type modalProps = {
    goals: {
        id: number;
        value: string;
    }[];
};

function CreateContribution({ goals }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<Date | string>(new Date());
    const [selectValue, setSelectValue] = useState<number | undefined>(undefined);

    const createModalState = useAppSelector((state) => state.createModal.show.goalContribution);

    useEffect(() => {
        if (!createModalState) {
            setSelectValue(undefined);
        }
    }, [createModalState]);

    const [createGoalContribution] = useCreateGoalContributionMutation();

    const createGoalContributionHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (selectValue === 0 || selectValue === undefined) errors.push("Goal must be selected");
        if (date === null) errors.push("Date cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const goalContributionData: createGoalContributionDto = {
            amount: amount,
            date: date,
            savingGoalId: selectValue!,
        };

        await createGoalContribution(goalContributionData)
            .unwrap()
            .catch(() => {
                throw [`Error creating goal contribution`];
            });
    };

    return (
        <CreateModal show={createModalState} createFunction={createGoalContributionHandler}>
            <AmountField fieldStateHandler={setAmount} />
            <SelectField<number | undefined>
                fieldStateHandler={setSelectValue}
                label="Goal"
                options={goals}
                value={selectValue}
            />
            <DateField fieldStateHandler={setDate} />
        </CreateModal>
    );
}

export default CreateContribution;
