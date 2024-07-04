import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown } from "@fortawesome/free-regular-svg-icons";
import {
    faAngleRight,
    faAngleLeft,
    faAngleDoubleRight,
    faAngleDoubleLeft,
    faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

function Table() {
    const [FilterDropState, setFilterDropState] = useState(false);

    return (
        <div className="flex flex-col w-full">
            <button className="tableButton flex gap-x-5 mb-2 bg-custom-secondary self-start items-center py-1 px-2 rounded-md">
                <p>Filters</p>
                <FontAwesomeIcon icon={faSquareCaretDown} />
            </button>

            <div></div>

            <table>
                <thead className="border-b border-custom-accent">
                    <tr className="tableRow">
                        <th>
                            <p>Details</p>
                        </th>
                        <th>
                            <p>Amount</p>
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
                            <p>Anually</p>
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
                            <p>ByWeekly</p>
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
            <div className="flex justify-center py-1 border-t border-custom-accent">
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button className="tableButton">
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button className="tableButton">1</button>
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
