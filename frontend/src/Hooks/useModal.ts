import { budgetPlanDto, expenseCategoryDto, expenseDto } from "@/features/Expenses/types";
import { useAppDispatch, useAppSelector } from "./stateHooks";
import { showModal as showCreateModal } from "@/reducers/createModalReducers";
import { showModal as showDetailsModal } from "@/reducers/detailsModalReducers";
import { incomeDto } from "@/features/Income/types";
import { savingGoalDto, goalContributionDto } from "@/features/Savings/types";

type DetailsModalDataMap = {
    expense: expenseDto;
    budgetPlanning: budgetPlanDto;
    expenseCategory: expenseCategoryDto;
    income: incomeDto;
    savingGoal: savingGoalDto;
    goalContribution: goalContributionDto;
};

function useModal() {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    const openCreationModal = (modal: keyof typeof createModalState) => {
        const newState = { ...createModalState, [modal]: true };
        dispatch(showCreateModal(newState));
    };

    const openDetailsModal = <T extends keyof DetailsModalDataMap>(
        modal: T,
        data: DetailsModalDataMap[T] | null
    ) => {
        if (data) {
            const newState = {
                ...detailsModalState,
                show: { ...detailsModalState.show, [modal]: true },
                data,
            };
            dispatch(showDetailsModal(newState));
        }
    };

    return {
        openCreationModal,
        openDetailsModal,
    };
}

export default useModal;
