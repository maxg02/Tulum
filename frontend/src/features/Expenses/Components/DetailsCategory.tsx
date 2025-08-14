import { useEffect, useState } from "react";
import { DetailsField } from "@/components/Modals/ModalsFields";
import { useAppSelector } from "@/Hooks/stateHooks";
import { expenseCategoryDto, updateExpenseCategoryDto } from "../types";
import { useDeleteExpenseCategoryMutation, useUpdateExpenseCategoryMutation } from "../api";
import DetailsModal from "@/components/Modals/DetailsModal";

function DetailsCategory() {
    const [details, setDetails] = useState<string>("");

    const detailsModalState = useAppSelector((state) => state.detailsModal);
    const categoryData = detailsModalState.data as expenseCategoryDto;

    const [deleteExpenseCategory] = useDeleteExpenseCategoryMutation();
    const [updateExpenseCategory] = useUpdateExpenseCategoryMutation();

    useEffect(() => {
        if (categoryData) {
            setDetails(categoryData.category);
        }
    }, [categoryData]);

    const updateExpenseCategoryHandler = async () => {
        const errors: string[] = [];
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw errors;
        }

        const expenseCategoryData: updateExpenseCategoryDto = {
            id: categoryData.id!,
            data: { category: details },
        };

        await updateExpenseCategory(expenseCategoryData)
            .unwrap()
            .catch(() => {
                throw [`Error updating category`];
            });
    };

    const deleteExpenseCategoryHandler = () => {
        const expenseCategoryId = categoryData.id;
        deleteExpenseCategory(expenseCategoryId!);
    };

    return (
        <DetailsModal
            updateFunction={updateExpenseCategoryHandler}
            deleteFunction={deleteExpenseCategoryHandler}
            show={detailsModalState.show.expenseCategory}
        >
            <DetailsField value={details} fieldStateHandler={setDetails} />
        </DetailsModal>
    );
}

export default DetailsCategory;
