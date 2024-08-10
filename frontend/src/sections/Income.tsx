import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table from "../components/Table";
import { dataObject } from "../components/Table";

export default function Budget() {
    const budgetPlanningData: dataObject = {
        columns: [
            { name: "Details", type: "string" },
            { name: "Amount", type: "amount" },
            {
                name: "Periodicity",
                type: "list",
                values: ["Annual", "Monthly", "Biweekly", "Weekly"],
            },
        ],
        rows: [
            ["Food", 3500, 3],
            ["Transport", 4000, 0],
            ["House/Utilities", 3000, 2],
            ["Personal/Medical", 3250, 1],
        ],
    };

    const incomeData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: [
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "06/05/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "15/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "12/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "05/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "25/03/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "05/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "15/04/24"],
        ],
    };

    const fixedIncomeData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            {
                name: "Periodicity",
                type: "list",
                values: ["Annual", "Monthly", "Biweekly", "Weekly"],
            },
        ],
        rows: [
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 0],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 1],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 2],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 3],
        ],
    };

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Budget" />
            <SectionContent>
                <Header currentSection="Budget" />
                <div className="flex-1 flex overflow-hidden gap-x-9">
                    <div className="flex flex-col w-5/12 gap-y-9">
                        <div className="infoContainer1 h-[18%]">
                            <p>Total Income</p>
                            <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                        </div>
                        <div className="flex gap-x-9 h-[18%]">
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>January Income</p>
                                <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                            </div>
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>2024 Income</p>
                                <h1 className="font-light text-5xl my-auto">RD$750K</h1>
                            </div>
                        </div>
                        <div className="infoContainer1 flex-1">
                            <p>Budget Planning</p>
                            <div className="flex flex-1 items-center w-full">
                                <Table data={budgetPlanningData} tablePrefix="BP" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-9">
                        <div className="flex-1 infoContainer2">
                            <p>Income</p>
                            <div className="flex items-center flex-1 w-full">
                                <Table dark data={incomeData} tablePrefix="I" />
                            </div>
                        </div>
                        <div className="infoContainer2">
                            <p>Fixed Income</p>
                            <div className="flex items-center w-full">
                                <Table data={fixedIncomeData} tablePrefix="FI" dark />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
