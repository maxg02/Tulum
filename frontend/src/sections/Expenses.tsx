import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { PieChart } from "@mui/x-charts/PieChart";
import { gradientColors } from "../components/Colors";
import DiamondList from "../components/DiamondList";
import Table, { dataObject } from "../components/Table";

export default function Expenses() {
    const [highlightedValue, setHighlightedValue] = useState(null);

    interface pieChartSlice {
        label: string;
        value: number;
    }

    const dataPieChart: pieChartSlice[] = [
        {
            label: "Food",
            value: 20000,
        },
        {
            label: "Transport",
            value: 2000,
        },
        {
            label: "House/Utilities",
            value: 14000,
        },
        {
            label: "Personal/Medical",
            value: 12000,
        },
        {
            label: "Others",
            value: 2500,
        },
    ];

    const expensesData: dataObject = {
        columns: [
            { name: "Expenses", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
            {
                name: "Category",
                type: "list",
                values: ["Food", "Transport", "House/Utilities", "Entertainment", "Personal/Medical"],
            },
        ],
        rows: [
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "06/05/24", 0],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "01/05/24", 1],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "29/04/24", 2],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "20/04/24", 3],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", "15/04/24", 4],
        ],
    };

    const budgetExpensesData: dataObject = {
        columns: [
            { name: "Budget", type: "string" },
            { name: "Expenses", type: "progress" },
        ],
        rows: [
            ["Food", { value: 3500, total: 6000 }],
            ["Transport", { value: 1500, total: 5000 }],
            ["House/Utilities", { value: 13000, total: 15000 }],
            ["Personal/Medical", { value: 4000, total: 7500 }],
        ],
    };

    const fixedExpensesData: dataObject = {
        columns: [
            { name: "Expense", type: "amount" },
            { name: "Details", type: "string" },
            {
                name: "Periodicity",
                type: "list",
                values: ["Annual", "Monthly", "Biweekly", "Weekly"],
            },
            {
                name: "Category",
                type: "list",
                values: ["Food", "Transport", "House/Utilities", "Entertainment", "Personal/Medical"],
            },
        ],
        rows: [
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 0, 0],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 1, 1],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 2, 2],
            [3500, "Lorem ipsum dolor sit amet consectetur. Mauris fusce.", 3, 3],
        ],
    };

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Expenses" />
            <SectionContent>
                <Header currentSection="Expenses" />
                <div className="flex-1 flex flex-col overflow-hidden gap-y-9">
                    <div className="flex flex-1 gap-x-9">
                        <div className="infoContainer1 w-2/5">
                            <p>January Expenses</p>
                            <div className="w-full flex-1 flex items-center justify-center gap-x-9">
                                <div className="w-80 h-full relative">
                                    <PieChart
                                        colors={[
                                            gradientColors[0],
                                            gradientColors[1],
                                            gradientColors[2],
                                            gradientColors[3],
                                            gradientColors[4],
                                        ]}
                                        margin={{ left: 0, right: 0 }}
                                        series={[
                                            {
                                                data: dataPieChart,
                                                id: "A",
                                                innerRadius: "65%",
                                                paddingAngle: 2,
                                                cornerRadius: 3,
                                                highlightScope: { fade: "global", highlight: "item" },
                                                faded: { color: "gray", additionalRadius: -5 },
                                                valueFormatter: (value) => `RD$${value.value}`,
                                            },
                                        ]}
                                        onHighlightChange={setHighlightedValue}
                                        slotProps={{ legend: { hidden: true } }}
                                        sx={{
                                            "& .MuiPieArc-root": { strokeWidth: 0 },
                                        }}
                                        tooltip={{
                                            trigger: "item",
                                            classes: {
                                                labelCell: "hidden",
                                                valueCell: "ml-3 p-3",
                                                markCell: "pl-3 pr-0",
                                            },
                                        }}
                                    ></PieChart>
                                    <h2 className="font-light text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        {`RD$${
                                            dataPieChart.reduce((acc, currentValue) => ({
                                                ...currentValue,
                                                value: acc.value + currentValue.value,
                                            })).value
                                        }`}
                                    </h2>
                                </div>
                                <DiamondList
                                    items={dataPieChart.map((x) => x.label)}
                                    highlightedItem={highlightedValue}
                                />
                            </div>
                        </div>
                        <div className="infoContainer1 flex-1">
                            <p>Expenses</p>
                            <div className="flex items-center flex-1 w-full">
                                <Table data={expensesData} tablePrefix="E" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-x-9">
                        <div className="infoContainer2 w-5/12">
                            <p>Budget Expenses</p>
                            <div className="flex items-center flex-1 w-full">
                                <Table dark data={budgetExpensesData} tablePrefix="BE" />
                            </div>
                        </div>
                        <div className="infoContainer2 flex-1">
                            <p>Fixed Expenses</p>
                            <div className="flex items-center flex-1 w-full">
                                <Table dark data={fixedExpensesData} tablePrefix="FE" />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
