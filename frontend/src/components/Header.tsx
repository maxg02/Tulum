import React from "react";
import { SectionType } from "./Sidebar";
import { useAppDispatch } from "../hooks";
import { logOut } from "../reducers/userReducers";

export default function Header({ currentSection }: { currentSection: SectionType }) {
    const dispatch = useAppDispatch();

    return (
        <div className="flex items-center justify-between h-14">
            <h1 className="text-5xl">{currentSection}</h1>
            <div className="h-full flex items-center gap-5">
                <img className="h-full w-auto rounded-xl" src="/profilePic.jpeg" alt="Profile Pic" />
                <p>Maria Ambroise</p>
            </div>
            <button onClick={() => dispatch(logOut())}>Logout</button>
        </div>
    );
}
