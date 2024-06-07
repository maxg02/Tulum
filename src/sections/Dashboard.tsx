import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import MoreDots from "../components/MoreDots";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
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

const customXTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
        <text dy={12} textAnchor="middle" fill="#DACEAF" fontFamily="karla" fontSize={"0.9rem"}>
            {payload.value}
        </text>
    </g>
);

const customYTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
        <text dy={2} textAnchor="end" fill="#DACEAF" fontFamily="karla" fontSize={"0.8rem"}>
            {payload.value}
        </text>
    </g>
);

const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white bg-opacity-20 p-2">
                <p>Income: RD${payload[0].value}</p>
                <p>Expense: RD${payload[1].value}</p>
            </div>
        );
    }
};

export default function Dashboard() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Dashboard" />
            <SectionContent>
                <Header currentSection="Dashboard" />
                <div className="flex-1 grid grid-cols-2 grid-rows-9 grid-flow-col gap-9">
                    <div className="row-span-4 infoContainer1 flex flex-col items-center justify-between">
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
                    <div className="row-start-5 row-span-5 infoContainer2 flex flex-col items-center justify-between">
                        <p>2024 Summary</p>

                        <div className="w-full flex-1 flex items-center">
                            <ResponsiveContainer height={"80%"}>
                                <LineChart
                                    data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <XAxis dataKey="name" tick={customXTick} />
                                    <YAxis tick={customYTick} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip content={customTooltip} />
                                    <Line type="linear" dataKey="inc" stroke="#78d2b5" strokeWidth={2} />
                                    <Line type="linear" dataKey="exp" stroke="#d96533" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`bg-white w-3 h-3 rounded-full border-[3.5px] border-[#78d2b5]`}
                                ></div>
                                <p className="text-custom-accent">Income</p>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`bg-white w-3 h-3 rounded-full border-[3.5px] border-[#d96533]`}
                                ></div>
                                <p className="text-custom-accent">Expense</p>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-5 infoContainer2">
                        <p>January Expenses</p>
                    </div>
                    <div className="row-span-4 infoContainer1">
                        <p>Saving Goals</p>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
