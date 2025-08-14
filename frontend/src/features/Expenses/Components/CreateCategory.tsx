import { useState } from "react";
import CreateModal from "@/components/Modals/CreateModal";
import { DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { createExpenseCategoryDto } from "../types";
import { useCreateExpenseCategoryMutation } from "../api";

function CreateCategory() {
    const [details, setDetails] = useState<string>("");

    const createModalState = useAppSelector((state) => state.createModal.show);

    const [createExpenseCategory] = useCreateExpenseCategoryMutation();

    const createExpenseCategoryHandler = async () => {
        const errors: string[] = [];
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const expenseCategoryData: createExpenseCategoryDto = {
            category: details,
        };

        await createExpenseCategory(expenseCategoryData)
            .unwrap()
            .catch(() => {
                throw [`Error creating category`];
            });
    };

    return (
        <CreateModal
            show={createModalState.expenseCategory}
            createFunction={createExpenseCategoryHandler}
        >
            <DetailsField fieldStateHandler={setDetails} />
        </CreateModal>
    );
}

export default CreateCategory;
