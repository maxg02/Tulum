import React from "react";
import { Link } from "react-router-dom";

export type SectionType = "Dashboard" | "Budget" | "Expenses" | "Savings";

export default function Sidebar({ currentSection }: { currentSection: SectionType }) {
    return (
        <div className="bg-custom-ly1 w-52">
            <h2>AppName</h2>
            <div className="flex flex-col">
                <Link to={"/"}>
                    <button
                        className={`${
                            currentSection === "Dashboard" ? "bg-red-500 text-white" : "bg-green-500"
                        }`}
                    >
                        Dashboard
                    </button>
                </Link>

                <Link to={"/budget"}>
                    <button
                        className={`${
                            currentSection === "Budget" ? "bg-red-500 text-white" : "bg-green-500"
                        }`}
                    >
                        Budget
                    </button>
                </Link>

                <Link to={"/expenses"}>
                    <button
                        className={`${
                            currentSection === "Expenses" ? "bg-red-500 text-white" : "bg-green-500"
                        }`}
                    >
                        Expenses
                    </button>
                </Link>

                <Link to={"/savings"}>
                    <button
                        className={`${
                            currentSection === "Savings" ? "bg-red-500 text-white" : "bg-green-500"
                        }`}
                    >
                        Savings
                    </button>
                </Link>
            </div>
        </div>
    );
}
