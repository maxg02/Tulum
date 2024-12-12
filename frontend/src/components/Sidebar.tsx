import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faWallet, faReceipt, faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { ReactNode } from "react";

export type SectionType = "Dashboard" | "Income" | "Expenses" | "Savings";

const sidebarButton = (active: boolean, section: string, icon: IconDefinition): ReactNode => (
    <button
        className={`${
            active ? "bg-custom-secondary" : "opacity-50 bg-transparent hover:bg-custom-secondary"
        } w-full flex items-center gap-3 border-0 px-3 py-1 rounded-none text-white`}
    >
        <div className="w-6 text-custom-accent text-xl flex items-center justify-center">
            <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="text-2xl">{section}</h3>
    </button>
);

export default function Sidebar({ currentSection }: { currentSection: SectionType }) {
    return (
        <div className="bg-custom-ly1 w-52 py-5">
            <div className="flex flex-col items-center mb-9">
                <img className="w-28" src="/appLogo.png" alt="App Logo" />
                <h2 className="text-4xl">AppName</h2>
            </div>

            <div className="flex flex-col gap-2">
                <Link to={"/"}>
                    {sidebarButton(currentSection === "Dashboard" ? true : false, "Dashboard", faHouse)}
                </Link>

                <Link to={"/income"}>
                    {sidebarButton(currentSection === "Income" ? true : false, "Income", faWallet)}
                </Link>

                <Link to={"/expenses"}>
                    {sidebarButton(currentSection === "Expenses" ? true : false, "Expenses", faReceipt)}
                </Link>

                <Link to={"/savings"}>
                    {sidebarButton(currentSection === "Savings" ? true : false, "Savings", faPiggyBank)}
                </Link>
            </div>
        </div>
    );
}
