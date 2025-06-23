import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logOut } from "../../reducers/userReducers";
import { toggleSidebar } from "../../reducers/utilitiesReducers";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

export default function Header() {
    const [dropdownShow, setDropdownShow] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const activeSection = useAppSelector((state) => state.utilities.activeSection);

    return (
        <div className="flex items-center justify-between h-14 relative">
            <div className="flex">
                <button className="me-3 xl:hidden" onClick={() => dispatch(toggleSidebar())}>
                    <HugeiconsIcon size={30} icon={Menu01Icon} />
                </button>
                <h1 className="text-3xl">{activeSection}</h1>
            </div>

            <div className="h-full flex items-center gap-5">
                <p className="hidden">{userInfo?.fullName}</p>
                <button
                    className="h-full p-0 rounded-xl overflow-hidden aspect-square"
                    onClick={() => (dropdownShow ? setDropdownShow(false) : setDropdownShow(true))}
                >
                    <img
                        className="h-full w-auto object-cover"
                        src={`${userInfo?.profileImage}`}
                        alt="Profile Pic"
                    />
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
