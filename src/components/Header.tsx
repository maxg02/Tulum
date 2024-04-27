import React from "react";
import { SectionType } from "./Sidebar";

export default function Header({ currentSection }: { currentSection: SectionType }) {
    return (
        <div className="flex items-center justify-between h-14">
            <h1 className="font-title">{currentSection}</h1>
            <div className="h-full flex items-center gap-5">
                <img className="h-full w-auto rounded-xl" src="/profilePic.jpeg" />
                <h4 className="font-body">Maria Ambroise</h4>
            </div>
        </div>
    );
}
