import useModal from "@/Hooks/useModal";
import { expenseCategoryDto, expenseDto } from "../types";

type expenseCardProps = {
    expense: expenseDto;
    expenseCategoryData: expenseCategoryDto[] | undefined;
};

function ExpenseCard({ expense: e, expenseCategoryData }: expenseCardProps) {
    const { openDetailsModal } = useModal();

    return (
        <button
            className="border-2 rounded-md p-2"
            key={e.id}
            onClick={() => openDetailsModal("expense", e)}
        >
            <div className="flex justify-between gap-16">
                <p className="font-bold text-ellipsis overflow-hidden text-nowrap">{e.details}</p>
                <p className="font-bold">RD${e.amount}</p>
            </div>
            <div className="flex justify-between">
                <p>
                    {e.expenseCategoryId != -1
                        ? expenseCategoryData?.find((ec) => ec.id === e.expenseCategoryId)?.category ??
                          "Others"
                        : "Others"}
                </p>
                <p>{new Date(e.date).toDateString()}</p>
            </div>
        </button>
    );
}

export default ExpenseCard;
