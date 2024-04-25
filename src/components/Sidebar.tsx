import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="bg-custom-ly1 w-52">
            <h2>AppName</h2>
            <div className="flex flex-col">
                <Link to={"/"}>Dashboard</Link>
                <Link to={"/budget"}>Budget</Link>
                <Link to={"/expenses"}>Expenses</Link>
                <Link to={"/Savings"}>Savings</Link>
            </div>
        </div>
    );
}
