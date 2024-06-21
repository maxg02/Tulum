import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";

export default function Savings() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Savings" />
            <SectionContent>
                <Header currentSection="Savings" />
                <div className="flex-1 grid grid-cols-16 grid-rows-12 grid-flow-row overflow-hidden gap-9">
                    <div className="row-span-12 col-span-3 infoContainer1"></div>
                    <div className="row-start-1 row-span-6 col-start-4 col-span-6 infoContainer1"></div>
                    <div className="row-start-1 row-span-6 col-span-7 infoContainer2"></div>
                    <div className="row-start-7 row-span-6 col-start-4 col-[13_/_span_13] infoContainer2"></div>
                </div>
            </SectionContent>
        </div>
    );
}
