import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CustomGauge from "../components/CustomGauge";
import Table, { dataObject } from "../components/Table";

export default function Savings() {
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
            { name: "FixedContribution", type: "amount" },
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

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Savings" />
            <SectionContent>
                <Header currentSection="Savings" />
                <div className="flex-1 flex overflow-hidden gap-x-8">
                    <div className="infoContainer1 w-64">
                        <p>Goals Progress</p>
                        <div className="flex-1 w-full flex flex-col gap-y-4 justify-between">
                            <FontAwesomeIcon icon={faChevronUp} className="flex-none" />
                            <div className="flex-1 w-full flex flex-col items-center">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={86} label="House" />
                                </div>
                                <p>
                                    <span className="text-custom-accent">RD$3000000</span>/RD$2580000
                                </p>
                            </div>
                            <div className="flex-1 w-full flex flex-col items-center">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={25} label="Car" />
                                </div>
                                <p>
                                    <span className="text-custom-accent">RD$1500000</span>/RD$375000
                                </p>
                            </div>
                            <div className="flex-1 w-full flex flex-col items-center">
                                <div className="flex-1 w-full mb-1">
                                    <CustomGauge value={40} label="University" />
                                </div>
                                <p>
                                    <span className="text-custom-accent">RD$50000</span>/RD$20000
                                </p>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} className="flex-none" />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-8">
                        <div className="flex flex-1 gap-x-8">
                            <div className="flex-auto flex flex-col justify-between">
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>January Budget</p>
                                    <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                                </div>
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>2024 Budget</p>
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
                            <p>Goals Contributions</p>
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
