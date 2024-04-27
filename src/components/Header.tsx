import React from "react";
import { SectionType } from "./Sidebar";

export default function Header({ currentSection }: { currentSection: SectionType }) {
    return (
        <div className="flex items-center justify-between h-14">
            <h1>{currentSection}</h1>
            <div className="h-full flex items-center gap-5">
                <img className="h-full w-auto rounded-xl" src="/profilePic.jpeg" alt="Profile Pic" />
                <h4>Maria Ambroise</h4>
            </div>
        </div>
    );
}
