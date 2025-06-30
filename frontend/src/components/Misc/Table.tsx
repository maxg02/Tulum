import { FilterAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import ProgressBar from "../Graphs/ProgressBar";

type sortValues = ("asc" | "desc" | "null")[];
export type tableRow = {
    id: number;
    data: (string | number | { value: number; total: number } | null | undefined)[];
};
export type dataObject = {
    columns: {
        name: string;
        type: "string" | "amount" | "list" | "date" | "progress";
        values?: string[];
    }[];
    rows: tableRow[];
};

function Table({
    data,
    dark = false,
    filters = true,
    detailsFunction,
}: {
    data: dataObject;
    dark?: boolean;
    filters?: boolean;
    detailsFunction?: (itemId: number) => void;
}) {
    const [FilterDropState, setFilterDropState] = useState<boolean>(false);
    const [ColumnsSort, setColumnsSort] = useState<sortValues>(data.columns.map(() => "null"));

    const handleSortToggle = (columnKey: number) => {
        const sortState = ColumnsSort;

        sortState[columnKey] =
            sortState[columnKey] === "null" ? "asc" : sortState[columnKey] === "asc" ? "desc" : "null";

        setColumnsSort([...sortState]);
    };

    const handleFilterDrop = () => {
        FilterDropState ? setFilterDropState(false) : setFilterDropState(true);
    };

    const TableHeader = () =>
        data.columns.map((item, key) => (
            <th key={key}>
                <div className="flex items-center gap-x-2 overflow-hidden">
                    <p>{item.name}</p>
                </div>
            </th>
        ));

    const TableRows = () =>
        data.rows.map((item, key) => (
            <tr
                className={`tableRow border-b ${
                    dark
                        ? "border-custom-ly1/60 hover:bg-custom-ly1"
                        : "border-custom-ly2/60 hover:bg-custom-ly2"
                } cursor-pointer`}
                key={key}
                onClick={() => detailsFunction(item.id)}
            >
                {item.data.map((content, key) => (
                    <td key={key}>
                        {data.columns[key].type === "string" || data.columns[key].type === "date" ? (
                            <p>{content}</p>
                        ) : data.columns[key].type === "amount" ? (
                            <p>{content === null || content === undefined ? "" : `RD$${content}`}</p>
                        ) : data.columns[key].type === "list" ? (
                            <p>{data.columns[key].values[content]}</p>
                        ) : (
                            <ProgressBar
                                dark={dark}
                                value={content.value ?? 0}
                                total={content.total ?? 0}
                            />
                        )}
                    </td>
                ))}
            </tr>
        ));

    const TableFilters = () =>
        data.columns.map((item, key) => (
            <div key={key} className="flex flex-col">
                <label htmlFor={item.name}>{item.name}</label>
                {item.type === "string" ? (
                    <>
                        <input
                            className="w-full formInput"
                            type="text"
                            id={item.name}
                            name={tablePrefix + item.name.toLocaleLowerCase()}
                            placeholder="Details"
                        />
                        <span className="formDivider"></span>
                    </>
                ) : item.type === "amount" ? (
                    <>
                        <div className="flex items-center">
                            <p className="mr-2">RD$</p>
                            <input
                                className="w-full formInput"
                                type="text"
                                id="minAmount"
                                name={`${tablePrefix}minAmount`}
                                placeholder="Min"
                            />
                            <p className="mx-2">-</p>
                            <p className="mr-2">RD$</p>
                            <input
                                className="w-full formInput"
                                type="text"
                                id="maxAmount"
                                name={`${tablePrefix}maxAmount`}
                                placeholder="Max"
                            />
                        </div>
                        <span className="formDivider"></span>
                    </>
                ) : item.type === "date" ? (
                    <>
                        <div className="flex items-center">
                            <p className="mr-2">From:</p>
                            <input
                                className="w-full formInput"
                                type="date"
                                id="dateFrom"
                                name={`${tablePrefix}dateFrom`}
                                placeholder="Min"
                            />
                            <p className="mx-2">-</p>
                            <p className="mr-2">To:</p>
                            <input
                                className="w-full formInput"
                                type="date"
                                id="dateTo"
                                name={`${tablePrefix}dateTo`}
                                placeholder="Max"
                            />
                        </div>
                        <span className="formDivider"></span>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col">
                            {item.values?.map((value, key) => (
                                <div key={key}>
                                    <input
                                        className="mr-2"
                                        type="checkbox"
                                        id={value}
                                        name={tablePrefix + value.toLocaleLowerCase()}
                                    />
                                    <label htmlFor={value}>{value}</label>
                                </div>
                            ))}
                        </div>
                        <span className="formDivider"></span>
                    </>
                )}
            </div>
        ));

    return (
        <div className="flex flex-col flex-1 w-full h-full overflow-hidden overflow-y-auto">
            {/* Filter Section */}
            {/* <div className="flex items-center mb-1 gap-x-3 sticky top-0 z-20">
                <div>
                    <div
                        className={`absolute border border-custom-ly2 border-opacity-80 bg-custom-ly1 ${
                            dark ? "" : "shadow-[0_0_5px_0.2px_rgba(0,0,0,0.4)]"
                        } mt-2 rounded-md p-3 ${
                            FilterDropState ? "" : "hidden"
                        } max-h-64 overflow-y-auto formContainer`}
                    >
                        <form className="filterForm flex flex-col gap-y-2">
                            <TableFilters />
                            <div className="self-end">
                                <button
                                    type="reset"
                                    onClick={() => setFilterDropState(false)}
                                    className="formButton"
                                >
                                    <p>Cancel</p>
                                </button>
                                <button className="formButton">
                                    <p>Apply</p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}
            {/* Table Section */}
            <table className="w-full border-collapse">
                <thead className={`sticky top-0 z-10 ${dark ? "bg-custom-ly2" : "bg-custom-ly1"}`}>
                    <tr className={`${filters || "hidden"}`}>
                        <th colSpan={data.columns.length}>
                            <button
                                className="tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                                onClick={handleFilterDrop}
                            >
                                <HugeiconsIcon
                                    size={20}
                                    icon={FilterAddIcon}
                                    className="text-custom-accent"
                                />
                            </button>
                        </th>
                    </tr>
                    <tr className="tableRow shadow-[0_1px_0px_0_#DACEAF]">
                        <TableHeader />
                    </tr>
                </thead>
                <tbody>
                    <TableRows />
                </tbody>
            </table>
        </div>
    );
}

export default Table;
