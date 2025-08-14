import React from "react";

type modalField<T> = {
    fieldStateHandler: React.Dispatch<React.SetStateAction<T>>;
    value?: T;
    customLabel?: string;
    disabled?: boolean;
};

type listModalField<T> = modalField<T> & { label: string; options: string[] };
type selectModalField<T> = modalField<T> & {
    label: string;
    options: { id: number; value: string }[] | undefined;
};

export function AmountField({ fieldStateHandler, value, customLabel }: modalField<number>) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="amount">{customLabel ?? "Amount"}</label>
            <input
                type="number"
                id="amount"
                name="amount"
                className="formInput w-full"
                placeholder="Amount"
                value={value ?? undefined}
                onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
            ></input>
        </div>
    );
}

export function DetailsField({ fieldStateHandler, value, customLabel }: modalField<string>) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="details">{customLabel ?? "Details"}</label>
            <input
                type="text"
                id="details"
                name="details"
                className="formInput w-full"
                placeholder="Details"
                value={value ?? undefined}
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function DateField({ fieldStateHandler, value, customLabel }: modalField<Date | string>) {
    const defaultDate = value ? value.toString().substring(0, 10) : undefined;

    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="date">{customLabel ?? "Date"}</label>
            <input
                type="date"
                id="date"
                name="date"
                className="formInput w-full"
                placeholder="Date"
                value={defaultDate}
                onClick={(e) => e.currentTarget.showPicker()}
                onChange={(e) => fieldStateHandler(e.target.value)}
            ></input>
        </div>
    );
}

export function ListField({
    fieldStateHandler,
    label,
    options,
    value,
}: listModalField<number | undefined>) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="date">{label}</label>
            {options.map((item, key) => (
                <div key={key} className="flex gap-x-2 justify-start">
                    <input
                        type="radio"
                        id={"list" + key}
                        name="list"
                        className="formInput"
                        placeholder="Date"
                        value={key}
                        onChange={(e) => fieldStateHandler(parseInt(e.target.value))}
                        checked={value !== undefined && key === value}
                    ></input>
                    <label htmlFor={"list" + key}>{item}</label>
                </div>
            ))}
        </div>
    );
}

export function SelectField<T>({
    fieldStateHandler,
    label,
    options,
    value,
    disabled = false,
}: selectModalField<T>) {
    return (
        <div className="flex flex-col gap-y-1">
            <label htmlFor="select">{label}</label>
            <select
                id="select"
                name={`select ${label}`}
                className="formInput bg-custom-ly2 border-none cursor-pointer"
                onChange={(e) => fieldStateHandler(parseInt(e.target.value) as T)}
                disabled={disabled}
                value={(value as number | undefined) ?? 0}
            >
                {value === undefined && (
                    <option disabled value={0}>
                        Select {label}
                    </option>
                )}
                {options &&
                    options.map((item, key) => (
                        <option key={key} value={item.id}>
                            {item.value}
                        </option>
                    ))}
            </select>
        </div>
    );
}
