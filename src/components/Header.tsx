import React from "react";
import { SectionType } from "./Sidebar";

export default function Header({ currentSection }: { currentSection: SectionType }) {
    return <div className="bg-green-400">{currentSection}</div>;
}
