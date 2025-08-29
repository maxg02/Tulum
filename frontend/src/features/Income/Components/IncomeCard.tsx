import useModal from "@/Hooks/useModal";
import React from "react";
import { incomeDto } from "../types";

function IncomeCard({ income }: { income: incomeDto }) {
    const { openDetailsModal } = useModal();

    return (
        <button
            className="border-2 rounded-md p-2 flex gap-x-16"
            key={income.id}
            onClick={() => openDetailsModal("income", income)}
        >
            <div className="flex flex-col items-start overflow-hidden">
                <p className="font-bold text-ellipsis overflow-hidden text-nowrap w-full text-start">
                    {income.details}
                </p>
                <p>{new Date(income.date).toDateString()}</p>
            </div>
            <div className="flex h-full items-center justify-end flex-1">
                <p className="font-bold">RD${income.amount}</p>
            </div>
        </button>
    );
}

export default IncomeCard;
