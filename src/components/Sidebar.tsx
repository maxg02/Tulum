import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeSection } from "../reducers/sectionReducer";

export default function Sidebar() {
    interface sectionRoute {
        section: string;
        route: string;
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigation = (section: sectionRoute) => {
        dispatch(changeSection(section.section));
        navigate(section.route);
    };

    return (
        <div className="bg-custom-ly1 w-52">
            <h2>AppName</h2>
            <div className="flex flex-col">
                <button onClick={() => handleNavigation({ section: "Dashboard", route: "/" })}>
                    Dashboard
                </button>
                <button onClick={() => handleNavigation({ section: "Budget", route: "/budget" })}>
                    Budget
                </button>
                <button onClick={() => handleNavigation({ section: "Expenses", route: "/expenses" })}>
                    Expenses
                </button>
                <button onClick={() => handleNavigation({ section: "Savings", route: "/savings" })}>
                    Savings
                </button>
            </div>
        </div>
    );
}
