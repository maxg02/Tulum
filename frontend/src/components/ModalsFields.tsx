import React from "react";

type modalField = {
    fieldStateHandler:
        | React.Dispatch<React.SetStateAction<number>>
        | React.Dispatch<React.SetStateAction<string>>
        | React.Dispatch<React.SetStateAction<Date>>;
};

type listModalField = modalField & { label: string; values: string[] };

export function AmountField({ fieldStateHandler }: modalField) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                id="amount"
                name="amount"
                className="formInput w-full"
                placeholder="Amount"
                onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
            ></input>
        </div>
    );
}

export function DetailsField({ fieldStateHandler }: modalField) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="details">Details</label>
            <input
                type="text"
                id="details"
                name="details"
                className="formInput w-full"
                placeholder="Details"
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function DateField({ fieldStateHandler }: modalField) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="date">Date</label>
            <input
                type="datetime-local"
                id="date"
                name="date"
                className="formInput w-full"
                placeholder="Date"
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function ListField({ fieldStateHandler, label, values }: listModalField) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="date">{label}</label>
            {values.map((item, key) => (
                <div key={key} className="flex gap-x-2 justify-start">
                    <input
                        type="radio"
                        id={"list" + key}
                        name="list"
                        className="formInput"
                        placeholder="Date"
                        value={key}
                        onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
                    ></input>
                    <label htmlFor={"list" + key}>{item}</label>
                </div>
            ))}
        </div>
    );
}
