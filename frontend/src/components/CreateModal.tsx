import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createIncomeDto, useCreateIncomeMutation } from "../../api/apiSlice";

export type modalProps = {
    show: boolean;
    handleClosing: () => void;
};

function CreateModal({ show, handleClosing }: modalProps) {
    const [createIncome, result] = useCreateIncomeMutation();
    const [amount, setAmount] = useState<number>(0);
    const [detail, setDetail] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());

    const handleCreateIncome = (e) => {
        e.preventDefault();
        const incomeData: createIncomeDto = {
            amount: amount,
            details: detail,
            date: date,
        };
        createIncome(incomeData);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="absolute left-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex">
            <div className="bg-custom-ly1 m-auto w-[30%] infoContainer1 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)]">
                <div className="grid grid-cols-3 w-full">
                    <p className="col-start-2 m-auto">Create Income</p>
                    <button
                        className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                        onClick={handleClosing}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <form className="flex flex-col gap-y-3 w-full">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="formInput w-full"
                            placeholder="Amount"
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                        ></input>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="details">Details</label>
                        <input
                            type="text"
                            id="details"
                            name="details"
                            className="formInput w-full"
                            placeholder="Details"
                            onChange={(e) => setDetail(e.target.value)}
                        ></input>
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="date">Date</label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            className="formInput w-full"
                            placeholder="Date"
                            onChange={(e) => setDate(e.target.value)}
                        ></input>
                    </div>
                    <span className="formDivider"></span>
                    <div className="self-end flex gap-x-2">
                        <button type="reset" className="formButton" onClick={handleClosing}>
                            <p>Cancel</p>
                        </button>
                        <button className="formButton" onClick={(event) => handleCreateIncome(event)}>
                            <p>Create</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateModal;
