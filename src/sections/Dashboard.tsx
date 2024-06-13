import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import MoreDots from "../components/MoreDots";
import { LineChart, markElementClasses } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { gradientColors } from "../components/Colors";
import DiamondList from "../components/DiamonList";

const dataLineChart = [
    {
        name: "Jan",
        inc: 45000,
        exp: 28000,
    },
    {
        name: "Feb",
        inc: 27000,
        exp: 30000,
    },
    {
        name: "Mar",
        inc: 45000,
        exp: 46000,
    },
    {
        name: "Apr",
        inc: 47000,
        exp: 30000,
    },
    {
        name: "May",
        inc: 30000,
        exp: 26000,
    },
    {
        name: "Jun",
        inc: 43000,
        exp: 44000,
    },
    {
        name: "Jul",
        inc: 47000,
        exp: 42000,
    },
    {
        name: "Aug",
        inc: 27000,
        exp: 28000,
    },
    {
        name: "Sep",
        inc: 41000,
        exp: 20000,
    },
    {
        name: "Oct",
        inc: 40000,
        exp: 22000,
    },
    {
        name: "Nov",
        inc: 43000,
        exp: 38500,
    },
    {
        name: "Dec",
        inc: 60000,
        exp: 55000,
    },
];

const dataPieChart = [
    {
        label: "Food",
        value: 1000,
    },
    {
        label: "Food",
        value: 400,
    },
    {
        label: "Food",
        value: 200,
    },
    {
        label: "Food",
        value: 300,
    },
    {
        label: "Food",
        value: 500,
    },
];

export default function Dashboard() {
    const [highlightedValue, setHighlightedValue] = useState();

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Dashboard" />
            <SectionContent>
                <Header currentSection="Dashboard" />
                <div className="flex-1 grid grid-cols-2 grid-rows-12 grid-flow-col overflow-hidden gap-9">
                    <div className="row-span-4 infoContainer1">
                        <p>January Income</p>
                        <h1 className="font-light">RD$50000</h1>
                        <div className="flex self-stretch justify-between border-t-2 py-3">
                            <div>
                                <p>(Wednesday 31) Biweekly payroll</p>
                                <p>(Monday 15) Water Bill</p>
                                <p>(Monday 1) Valentin’s Gift</p>
                            </div>
                            <div className="text-end">
                                <p className="text-custom-accent">RD$15000</p>
                                <p className="text-custom-accent">RD$3500</p>
                                <p className="text-custom-accent">RD$5000</p>
                            </div>
                        </div>
                        <MoreDots section="/budget" />
                    </div>
                    <div className="row-start-5 row-span-8 infoContainer2">
                        <p>2024 Summary</p>
                        <div className="w-full flex-1 flex items-center py-4">
                            <LineChart
                                margin={{ left: 50, right: 11, top: 25 }}
                                xAxis={[
                                    {
                                        dataKey: "name",
                                        scaleType: "point",
                                    },
                                ]}
                                yAxis={[{ min: 10000 }]}
                                series={[
                                    {
                                        dataKey: "inc",
                                        label: "Income",
                                        color: "#78d2b5",
                                        curve: "linear",
                                        stackOrder: "appearance",
                                    },
                                    {
                                        dataKey: "exp",
                                        label: "Expenses",
                                        color: "#d96533",
                                        curve: "linear",
                                    },
                                ]}
                                dataset={dataLineChart}
                                grid={{ vertical: true, horizontal: true }}
                                slotProps={{ legend: { hidden: true } }}
                                sx={{
                                    [`& .${markElementClasses.root}`]: {
                                        scale: "0.9",
                                        fill: "#394942",
                                        strokeWidth: 2,
                                    },
                                    "& .MuiChartsAxisHighlight-root": {
                                        stroke: "white",
                                        strokeDasharray: 0,
                                        strokeOpacity: 0.6,
                                    },
                                }}
                            />
                        </div>

                        <div className="flex gap-6">
                            <div className="flex flex-col items-center gap-1">
                                <div className={` w-2 h-2 rounded-full border-2 border-[#78d2b5]`}></div>
                                <p>Income</p>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <div className={` w-2 h-2 rounded-full border-2 border-[#d96533]`}></div>
                                <p>Expense</p>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-6 infoContainer2">
                        <p>January Expenses</p>
                        <div className="w-full flex-1 flex items-center justify-center gap-x-14">
                            <div className="min-w-72 h-full relative py-3">
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
                                            innerRadius: 70,
                                            paddingAngle: 2,
                                            cornerRadius: 3,
                                            highlightScope: { fade: "global", highlight: "item" },
                                        },
                                    ]}
                                    slotProps={{ legend: { hidden: true } }}
                                    sx={{ "& .MuiPieArc-root": { strokeWidth: 0 } }}
                                    tooltip={{ trigger: "none" }}
                                ></PieChart>
                                <h2 className="font-light text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    RD$16000
                                </h2>
                            </div>
                            <DiamondList
                                items={[
                                    "Food",
                                    "Transport",
                                    "House/Utilities",
                                    "Personal/Medical",
                                    "Others",
                                ]}
                            />
                        </div>
                        <div className="flex self-stretch justify-between border-t-2 py-3">
                            <div>
                                <p>(Wednesday 31) Biweekly payroll</p>
                                <p>(Monday 15) Water Bill</p>
                                <p>(Monday 1) Valentin’s Gift</p>
                            </div>
                            <div className="text-end">
                                <p className="text-custom-accent">RD$15000</p>
                                <p className="text-custom-accent">RD$3500</p>
                                <p className="text-custom-accent">RD$5000</p>
                            </div>
                        </div>
                        <MoreDots section="/expenses" />
                    </div>
                    <div className="row-span-6 infoContainer1">
                        <p>Saving Goals</p>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
