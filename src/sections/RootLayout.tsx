import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <div className="bg-custom-bg flex w-screen h-screen px-8 gap-8">
            <Sidebar />
            <div className="flex-1 flex flex-col py-8 gap-8">
                <Header />
                <Outlet />
            </div>
        </div>
    );
}
