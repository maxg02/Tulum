import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import MoreDots from "../components/MoreDots";

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
                                <p>(Monday 15 ) Water Bill</p>
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
                    <div className="row-start-5 row-span-5 infoContainer2">
                        <p>2024 Summary</p>
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
