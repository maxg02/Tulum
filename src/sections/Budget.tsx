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
            ["University", 3800, 3],
        ],
    };

    const incomeData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "string" },
        ],
        rows: [
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "06/05/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "15/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "12/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "05/04/24"],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "25/03/24"],
        ],
    };

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Budget" />
            <SectionContent>
                <Header currentSection="Budget" />
                <div className="flex-1 grid grid-cols-2 grid-rows-12 grid-flow-col overflow-hidden gap-9">
                    <div className="row-span-3 infoContainer1 justify-items-center">
                        <p>Total Budget</p>
                        <h1 className="font-light text-5xl flex-1 flex items-center">RD$75000</h1>
                    </div>
                    <div className="row-span-3  flex gap-x-9">
                        <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                            <p>January Budget</p>
                            <h1 className="font-light text-5xl flex-1 flex items-center">RD$75000</h1>
                        </div>
                        <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                            <p>2024 Budget</p>
                            <h1 className="font-light text-5xl flex-1 flex items-center">RD$750K</h1>
                        </div>
                    </div>
                    <div className="row-span-6 infoContainer1">
                        <p>Budget Planning</p>
                        <div className="flex items-center flex-1 w-full">
                            <Table data={budgetPlanningData} />
                        </div>
                    </div>
                    <div className="row-span-7 infoContainer2">
                        <p>Income</p>
                        <div className="flex items-center flex-1 w-full">
                            <Table dark data={incomeData} />
                        </div>
                    </div>
                    <div className="row-span-5 infoContainer2"></div>
                </div>
            </SectionContent>
        </div>
    );
}
