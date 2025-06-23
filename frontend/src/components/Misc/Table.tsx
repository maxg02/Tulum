import {
    FilterAddIcon,
    ArrowRight01Icon,
    ArrowLeft01Icon,
    ArrowLeftDoubleIcon,
    ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
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
    tablePrefix,
    detailsFunction,
    rowLimit,
}: {
    data: dataObject;
    dark?: boolean;
    tablePrefix: string;
    detailsFunction?: (itemId: number) => void;
    rowLimit: number;
}) {
    const [FilterDropState, setFilterDropState] = useState<boolean>(false);
    const [ColumnsSort, setColumnsSort] = useState<sortValues>(data.columns.map(() => "null"));
    const [pagination, setPagination] = useState<number>(1);

    const lastPage = Math.ceil(data.rows.length / rowLimit);

    const handlePaginationNext = () => {
        pagination < lastPage && setPagination(pagination + 1);
    };

    const handlePaginationToValue = (page: number) => {
        setPagination(page);
    };

    const handlePaginationPrevious = () => {
        pagination > 1 && setPagination(pagination - 1);
    };

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
                <div className="flex items-center gap-x-2">
                    <p>{item.name}</p>
                </div>
            </th>
        ));

    const pageNumbers = () => {
        const pageNodes = [];

        if (lastPage < 7) {
            for (let i = 1; i <= lastPage; i++) {
                pageNodes.push(
                    <button
                        onClick={() => handlePaginationToValue(i)}
                        className={`tableButton ${i === pagination && "text-custom-accent"}`}
                    >
                        {i}
                    </button>
                );
            }
            return pageNodes;
        }

        if (pagination < 5) {
            for (let i = 1; i < 6; i++) {
                pageNodes.push(
                    <button
                        onClick={() => handlePaginationToValue(i)}
                        className={`tableButton ${i === pagination && "text-custom-accent"}`}
                    >
                        {i}
                    </button>
                );
            }
            pageNodes.push(
                ". . .",
                <button
                    onClick={() => handlePaginationToValue(lastPage)}
                    className={`tableButton ${pagination === lastPage && "text-custom-accent"}`}
                >
                    {lastPage}
                </button>
            );

            return pageNodes;
        }

        if (pagination >= 5 && pagination <= lastPage - 6) {
            pageNodes.push(
                <button
                    onClick={() => handlePaginationToValue(1)}
                    className={`tableButton ${pagination === 1 && "text-custom-accent"}`}
                >
                    {1}
                </button>,
                ". . ."
            );

            for (let i = pagination - 2; i <= pagination + 2; i++) {
                pageNodes.push(
                    <button
                        onClick={() => handlePaginationToValue(i)}
                        className={`tableButton ${i === pagination && "text-custom-accent"}`}
                    >
                        {i}
                    </button>
                );
            }

            pageNodes.push(
                ". . .",
                <button
                    onClick={() => handlePaginationToValue(lastPage)}
                    className={`tableButton ${pagination === lastPage && "text-custom-accent"}`}
                >
                    {lastPage}
                </button>
            );

            return pageNodes;
        }

        if (pagination > lastPage - 6) {
            pageNodes.push(
                <button
                    onClick={() => handlePaginationToValue(1)}
                    className={`tableButton ${pagination === 1 && "text-custom-accent"}`}
                >
                    {1}
                </button>,
                ". . ."
            );
            for (let i = lastPage - 5; i <= lastPage; i++) {
                pageNodes.push(
                    <button
                        onClick={() => handlePaginationToValue(i)}
                        className={`tableButton ${i === pagination && "text-custom-accent"}`}
                    >
                        {i}
                    </button>
                );
            }
        }

        return pageNodes;
    };

    const TableRows = () =>
        data.rows.slice(rowLimit * (pagination - 1), rowLimit * pagination).map((item, key) => (
            <tr
                className={`tableRow ${
                    dark
                        ? "border-custom-ly1 hover:bg-custom-ly1"
                        : "border-custom-ly2 hover:bg-custom-ly2"
                } cursor-pointer`}
                key={key}
                onClick={() => detailsFunction(item.id)}
            >
                {item.data.map((content, key) => (
                    <td key={key}>
                        {data.columns[key].type === "string" || data.columns[key].type === "date" ? (
                            <p className="truncate">{content}</p>
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
        <div className="flex flex-col flex-1">
            {/* Filter Section */}
            <div className="flex items-center mb-1 gap-x-3">
                <div>
                    <button
                        className="tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                        onClick={handleFilterDrop}
                    >
                        <HugeiconsIcon size={20} icon={FilterAddIcon} className="text-custom-accent" />
                    </button>
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
            </div>
            {/* Table Section */}
            <table className="table-fixed">
                <thead>
                    <tr className="tableRow border-b border-custom-accent">
                        <TableHeader />
                    </tr>
                </thead>
                <tbody>
                    <TableRows />
                </tbody>
            </table>
            {/* Pagination Section */}
            <div className="flex justify-center py-2 border-t border-custom-accent">
                <button className="tableButton">
                    <HugeiconsIcon icon={ArrowLeftDoubleIcon} />
                </button>
                <button className="tableButton" onClick={handlePaginationPrevious}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} />
                </button>
                {pageNumbers()}
                <button className="tableButton" onClick={handlePaginationNext}>
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                </button>
                <button className="tableButton" onClick={() => handlePaginationToValue(lastPage)}>
                    <HugeiconsIcon icon={ArrowRightDoubleIcon} />
                </button>
            </div>
        </div>
    );
}

export default Table;
