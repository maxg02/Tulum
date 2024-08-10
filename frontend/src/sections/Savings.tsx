import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CustomGauge from "../components/CustomGauge";
import Table, { dataObject } from "../components/Table";

export type goalsProgress = {
    value: number;
    label: string;
    total: number;
    progress: number;
};

export default function Savings() {
    const [goalsProgressScroll, setGoalsProgressScroll] = useState<number>(0);

    const goalsContributionsData: dataObject = {
        columns: [
            { name: "Deposit", type: "amount" },
            { name: "Goal", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: [
            [3500, "Car", "06/05/22"],
            [5000, "Transport", "06/05/22"],
            [150000, "House", "06/05/22"],
            [15000, "University", "06/05/22"],
        ],
    };

    const savingGoalsData: dataObject = {
        columns: [
            { name: "Detail", type: "string" },
            { name: "Cost", type: "amount" },
            { name: "Fixed Contribution", type: "amount" },
            { name: "Periodicity", type: "list", values: ["Annual", "Monthly", "Biweekly", "Weekly"] },
        ],
        rows: [
            ["House", 3000000, 1000, 3],
            ["Car", 1500000, null, null],
            ["University", 50000, 15000, 2],
            ["Weeding", 50000, 15000, 2],
            ["Computer", 60000, 5000, 1],
        ],
    };

    const goalsProgress: goalsProgress[] = [
        { value: 86, label: "House", total: 3000000, progress: 2580000 },
        { value: 25, label: "Car", total: 1500000, progress: 375000 },
        { value: 40, label: "University", total: 50000, progress: 20000 },
        { value: 60, label: "Weeding", total: 50000, progress: 30000 },
        { value: 60, label: "Luhanny", total: 50000, progress: 30000 },
    ];

    const goalProgressGauges = () =>
        goalsProgress.map((item, key) => (
            <div
                key={key}
                className="w-full flex flex-col items-center py-4"
                style={{ height: `${100 / goalsProgress.length}%` }}
            >
                <div className="flex-1 w-full mb-1">
                    <CustomGauge value={item.value} label={item.label} />
                </div>
                <p>
                    <span className="text-custom-accent">RD${item.total}</span>/RD${item.progress}
                </p>
            </div>
        ));

    const goalProgressScrollUp = () => setGoalsProgressScroll(goalsProgressScroll + 1);
    const goalProgressScrollDown = () => setGoalsProgressScroll(goalsProgressScroll - 1);

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Savings" />
            <SectionContent>
                <Header currentSection="Savings" />
                <div className="flex-1 flex overflow-hidden gap-x-8">
                    <div className="infoContainer1 w-64">
                        <p>Goals Progress</p>
                        <div className="flex-1 w-full flex flex-col gap-y-4 justify-between overflow-y-hidden">
                            <button
                                className={`bg-transparent border-0 p-0 outline-0 ${
                                    goalsProgressScroll <= 0
                                        ? "hover:text-gray-400 text-gray-400"
                                        : "hover:text-custom-accent"
                                }`}
                                onClick={goalProgressScrollDown}
                                disabled={goalsProgressScroll <= 0 ? true : false}
                            >
                                <FontAwesomeIcon icon={faChevronUp} className="flex-none py-1" />
                            </button>
                            <div className="flex-1 overflow-y-hidden relative">
                                <div className="bg-gradient-to-b from-custom-ly1 to-transparent w-full h-4 absolute top-0 z-30"></div>
                                <div
                                    className="w-full overflow-y-hidden relative"
                                    id="goalsCarrousell"
                                    style={{
                                        height: `${33.333333333 * goalsProgress.length}%`,
                                        top: `${-33 * goalsProgressScroll}%`,
                                    }}
                                >
                                    {goalProgressGauges()}
                                </div>
                                <div className="bg-gradient-to-t from-custom-ly1 to-transparent w-full h-4 absolute bottom-0 z-30"></div>
                            </div>
                            <button
                                className={`bg-transparent border-0 p-0 outline-0 ${
                                    goalsProgressScroll >= goalsProgress.length - 3
                                        ? "hover:text-gray-400 text-gray-400"
                                        : "hover:text-custom-accent"
                                }`}
                                onClick={goalProgressScrollUp}
                                disabled={goalsProgressScroll >= goalsProgress.length - 3 ? true : false}
                            >
                                <FontAwesomeIcon icon={faChevronDown} className="flex-none py-1" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-8">
                        <div className="flex flex-1 gap-x-8">
                            <div className="flex-auto flex flex-col justify-between">
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>January Savings</p>
                                    <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                                </div>
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>2024 Savings</p>
                                    <h1 className="font-light text-5xl my-auto">RD$750K</h1>
                                </div>
                            </div>
                            <div className="infoContainer2 flex-auto basis-3/5">
                                <p>Goals Contributions</p>
                                <div className="flex flex-1 items-center w-full">
                                    <Table data={goalsContributionsData} tablePrefix="GC" dark />
                                </div>
                            </div>
                        </div>
                        <div className="infoContainer2 flex-1">
                            <p>Saving Goals</p>
                            <div className="flex flex-1 items-center w-full">
                                <Table data={savingGoalsData} tablePrefix="SG" dark />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
