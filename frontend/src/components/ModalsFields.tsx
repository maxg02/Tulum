import React from "react";

type modalField = {
    fieldStateHandler:
        | React.Dispatch<React.SetStateAction<number>>
        | React.Dispatch<React.SetStateAction<string>>
        | React.Dispatch<React.SetStateAction<Date>>;
    defaultValue?: number | string | Date;
};

type listModalField = modalField & { label: string; values: string[] };
type selectModalField = modalField & { label: string; values: { id: number; value: string }[] };

export function AmountField({ fieldStateHandler, defaultValue }: modalField & { defaultValue: number }) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                id="amount"
                name="amount"
                className="formInput w-full"
                placeholder="Amount"
                value={defaultValue ?? undefined}
                onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
            ></input>
        </div>
    );
}

export function DetailsField({ fieldStateHandler, defaultValue }: modalField & { defaultValue: string }) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="details">Details</label>
            <input
                type="text"
                id="details"
                name="details"
                className="formInput w-full"
                placeholder="Details"
                value={defaultValue ?? undefined}
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function DateField({ fieldStateHandler, defaultValue }: modalField & { defaultValue: Date }) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="date">Date</label>
            <input
                type="datetime-local"
                id="date"
                name="date"
                className="formInput w-full"
                placeholder="Date"
                value={defaultValue ?? undefined}
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function ListField({
    fieldStateHandler,
    label,
    values,
    defaultValue,
}: listModalField & { defaultValue: number }) {
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
                        checked={defaultValue ? key === defaultValue : undefined}
                    ></input>
                    <label htmlFor={"list" + key}>{item}</label>
                </div>
            ))}
        </div>
    );
}

export function SelectField({
    fieldStateHandler,
    label,
    values,
    defaultValue,
}: selectModalField & { defaultValue: number }) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="select">{label}</label>
            <select
                id="select"
                name={`select ${label}`}
                className="formInput bg-custom-ly1 bg-custom-ly2 border-none cursor-pointer"
                onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
            >
                {values
                    ? values.map((item, key) => (
                          <option
                              selected={item.id === defaultValue ? true : undefined}
                              key={key}
                              value={item.id}
                          >
                              {item.value}
                          </option>
                      ))
                    : null}
            </select>
        </div>
    );
}
