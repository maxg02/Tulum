import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleLeft,
    faAngleDoubleRight,
    faAngleDoubleLeft,
    faEllipsis,
    faPlus,
    faXmark,
    faSort,
    faSortDown,
    faSortUp,
} from "@fortawesome/free-solid-svg-icons";

type sortValues = "asc" | "desc" | null;

function Table() {
    const [FilterDropState, setFilterDropState] = useState<boolean>(false);
    const [DetailsSort, setDetailsSort] = useState<sortValues>(null);
    const [AmountSort, setAmountSort] = useState<sortValues>(null);

    const handleSortToggle = (
        stateFunc: React.Dispatch<React.SetStateAction<sortValues>>,
        stateVal: sortValues
    ) => {
        stateVal === null ? stateFunc("asc") : stateVal === "asc" ? stateFunc("desc") : stateFunc(null);
    };

    const handleFilterDrop = () => {
        FilterDropState ? setFilterDropState(false) : setFilterDropState(true);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center mb-1 gap-x-3">
                <div>
                    <button
                        className="tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                        onClick={handleFilterDrop}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Add Filter</p>
                    </button>

                    <div
                        className={`absolute border border-custom-ly2 border-opacity-80 bg-custom-ly1 shadow-[0_0_5px_0.2px_rgba(0,0,0,0.4)] mt-2 rounded-md p-3 ${
                            FilterDropState ? "" : "hidden"
                        }`}
                    >
                        <form className="filterForm">
                            <div>
                                <label>Details</label>
                                <input className="flex-1" type="text" name="details" />
                            </div>
                            <div>
                                <label>Amount</label>
                                <input className="flex-1" type="range" name="amount" />
                            </div>
                            <div>
                                <label>Periodicity</label>
                                <select className="text-black flex-1" name="periodicity">
                                    <option className="text-black" value="annual">
                                        Annual
                                    </option>
                                    <option className="text-black" value="monthly">
                                        Monthly
                                    </option>
                                    <option className="text-black" value="biweekly">
                                        Biweekly
                                    </option>
                                    <option className="text-black" value="weekly">
                                        Weekly
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="bg-custom-ly2 px-3 py-1 rounded-md bg-opacity-70 flex items-center gap-x-2">
                    <div className="flex gap-x-1">
                        <p className="font-medium">Amount</p>
                        <p className="opacity-70"> Between </p>
                        <p className="font-medium">RD$3000</p>
                        <p className="opacity-70"> and </p>
                        <p className="font-medium">RD$4000</p>
                    </div>
                    <button className="tableButton p-0">
                        <FontAwesomeIcon icon={faXmark} className="text-custom-bg" />
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr className="tableRow border-b border-custom-accent">
                        <th>
                            <div className="flex items-center gap-x-2">
                                <p>Details</p>
                                <button
                                    className="tableButton p-0"
                                    onClick={() => handleSortToggle(setDetailsSort, DetailsSort)}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            DetailsSort === null
                                                ? faSort
                                                : DetailsSort === "asc"
                                                ? faSortUp
                                                : faSortDown
                                        }
                                        className="text-xs"
                                    />
                                </button>
                            </div>
                        </th>
                        <th>
                            <div className="flex items-center gap-x-2">
                                <p>Amount</p>
                                <button
                                    className="tableButton p-0"
                                    onClick={() => handleSortToggle(setAmountSort, AmountSort)}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            AmountSort === null
                                                ? faSort
                                                : AmountSort === "asc"
                                                ? faSortUp
                                                : faSortDown
                                        }
                                        className="text-xs"
                                    />
                                </button>
                            </div>
                        </th>
                        <th>
                            <p>Periodicity</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="tableRow">
                        <td>
                            <p>Food</p>
                        </td>
                        <td>
                            <p>RD$3500</p>
                        </td>
                        <td className="flex justify-between">
                            <p>Weekly</p>
                        </td>
                    </tr>
                    <tr className="tableRow">
                        <td>
                            <p>Transport</p>
                        </td>
                        <td>
                            <p>RD$3500</p>
                        </td>
                        <td className="flex justify-between">
                            <p>Annual</p>
                        </td>
                    </tr>
                    <tr className="tableRow">
                        <td>
                            <p>House/Utilities</p>
                        </td>
                        <td>
                            <p>RD$3500</p>
                        </td>
                        <td className="flex justify-between">
                            <p>Biweekly</p>
                        </td>
                    </tr>
                    <tr className="tableRow">
                        <td>
                            <p>Personal/Medical</p>
                        </td>
                        <td>
                            <p>RD$3500</p>
                        </td>
                        <td className="flex justify-between">
                            <p>Monthly</p>
                        </td>
                    </tr>
                    <tr className="tableRow">
                        <td>
                            <p>University</p>
                        </td>
                        <td>
                            <p>RD$3500</p>
                        </td>
                        <td className="flex justify-between">
                            <p>Monthly</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-center py-2 border-t border-custom-accent">
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button className="tableButton text-custom-accent">1</button>
                <button className="tableButton">2</button>
                <button className="tableButton">3</button>
                <button className="tableButton">4</button>
                <button className="tableButton">
                    <FontAwesomeIcon icon={faEllipsis} />
                </button>
                <button className="tableButton">10</button>
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
            </div>
        </div>
    );
}

export default Table;
