import React from "react";
import { expenseCategoryDto, expenseDto } from "../types";

type expenseCardProps = {
    expense: expenseDto;
    expenseCategoryData: expenseCategoryDto[] | undefined;
    showDetailsExpenseModal: (id: number) => void;
};

function ExpenseCard({ expense: e, expenseCategoryData, showDetailsExpenseModal }: expenseCardProps) {
    return (
        <button
            className="border-2 rounded-md p-2"
            key={e.id}
            onClick={() => showDetailsExpenseModal(e.id)}
        >
            <div className="flex justify-between gap-16">
                <p className="font-bold text-ellipsis overflow-hidden text-nowrap">{e.details}</p>
                <p className="font-bold">RD${e.amount}</p>
            </div>
            <div className="flex justify-between">
                <p>
                    {e.expenseCategoryId != -1
                        ? expenseCategoryData?.find((ec) => ec.id === e.expenseCategoryId)!.category
                        : "Others"}
                </p>
                <p>{new Date(e.date).toDateString()}</p>
            </div>
        </button>
    );
}

export default ExpenseCard;
