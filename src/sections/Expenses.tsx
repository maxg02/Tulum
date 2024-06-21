import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";

export default function Expenses() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Expenses" />
            <SectionContent>
                <Header currentSection="Expenses" />
                <div className="flex-1 grid grid-cols-14 grid-rows-12 grid-flow-col overflow-hidden gap-9">
                    <div className="row-span-6 col-span-6 infoContainer1"></div>
                    <div className="row-span-6 col-span-7 infoContainer2"></div>
                    <div className="row-span-6 col-span-8 infoContainer1"></div>
                    <div className="row-span-6 col-span-7 infoContainer2"></div>
                </div>
            </SectionContent>
        </div>
    );
}
