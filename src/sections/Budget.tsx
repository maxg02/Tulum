import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";

export default function Budget() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Budget" />
            <SectionContent>
                <Header currentSection="Budget" />
                <div className="bg-purple-400 flex-1">Budget</div>
            </SectionContent>
        </div>
    );
}
