import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDeleteIncomeMutation, useGetIncomesByIdQuery } from "../../api/apiSlice";
import Loader from "./Loader";

type modalProps = {
    openFunc: React.Dispatch<React.SetStateAction<{ open: boolean; itemId: number | null }>>;
    itemId: number;
};

function DetailsModal({ openFunc, itemId }: modalProps) {
    const [amount, setAmount] = useState<number>(0);
    const [detail, setDetail] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [id, setId] = useState<number>(0);

    const { data, error, isLoading } = useGetIncomesByIdQuery(itemId);
    const [deleteIncome, result] = useDeleteIncomeMutation();

    useEffect(() => {
        if (!isLoading && data != undefined) {
            setAmount(data.amount), setDetail(data.details), setDate(data.date), setId(data.id);
        }
    }, [isLoading, data]);

    const handleClosing = () => {
        openFunc({ open: false, itemId: null });
    };

    const handleDeleteIncome = (e) => {
        e.preventDefault;
        deleteIncome(id);
        console.log(result);
        handleClosing();
    };

    return (
        <div className="absolute left-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex">
            <div className="bg-custom-ly1 m-auto w-[30%] infoContainer1 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)]">
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="grid grid-cols-3 w-full">
                            <p className="col-start-2 m-auto">Income Details</p>
                            <button
                                className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                onClick={() => openFunc(false)}
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
                                    value={amount}
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
                                    value={detail}
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
                                    value={date}
                                ></input>
                            </div>
                            <span className="formDivider"></span>
                            <div className="self-end flex gap-x-2">
                                <button
                                    type="reset"
                                    className="formButton"
                                    onClick={() => handleClosing()}
                                >
                                    <p>Cancel</p>
                                </button>
                                <button
                                    className="formButton hover:bg-red-500"
                                    onClick={(event) => handleDeleteIncome(event)}
                                >
                                    <p>Delete</p>
                                </button>
                                <button
                                    className="formButton"
                                    onClick={(event) => handleCreateIncome(event)}
                                >
                                    <p>Save</p>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default DetailsModal;
