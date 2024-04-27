import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";

export default function Dashboard() {
    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Dashboard" />
            <SectionContent>
                <Header currentSection="Dashboard" />
                <div className="bg-purple-400 flex-1">Dashboard</div>
            </SectionContent>
        </div>
    );
}
