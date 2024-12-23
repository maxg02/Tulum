import React, { useState } from "react";
import { SectionType } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logOut } from "../reducers/userReducers";

export default function Header({ currentSection }: { currentSection: SectionType }) {
    const [dropdownShow, setDropdownShow] = useState<boolean>(true);

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);

    return (
        <div className="flex items-center justify-between h-14 relative">
            <h1 className="text-5xl">{currentSection}</h1>
            <div className="h-full flex items-center gap-5">
                <p>{userInfo?.fullName}</p>
                <button
                    className="h-full p-0 rounded-xl overflow-hidden border-0 focus:outline-none"
                    onClick={() => (dropdownShow ? setDropdownShow(false) : setDropdownShow(true))}
                >
                    <img className="h-full w-auto " src="/profilePic.jpeg" alt="Profile Pic" />
                </button>
            </div>
            {dropdownShow && (
                <div className="absolute right-0 top-full infoContainer1 items-stretch z-50 py-4 px-0 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)] w-28">
                    <button
                        className="tableButton rounded-none hover:bg-custom-secondary hover:text-inherit py-2"
                        onClick={() => {
                            dispatch(logOut());
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
