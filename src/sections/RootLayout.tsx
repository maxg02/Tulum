import React from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <div className="bg-custom-bg flex w-screen h-screen px-8">
            <Outlet />
        </div>
    );
}
