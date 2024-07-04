import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table from "../components/Table";

export default function Budget() {
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
                            <Table />
                        </div>
                    </div>
                    <div className="row-span-7 infoContainer2"></div>
                    <div className="row-span-5 infoContainer2"></div>
                </div>
            </SectionContent>
        </div>
    );
}
