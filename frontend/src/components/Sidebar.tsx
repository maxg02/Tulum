import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    DashboardSpeed01Icon,
    Invoice02Icon,
    MoneySavingJarIcon,
    Github01FreeIcons,
    Linkedin01FreeIcons,
    MoneyReceiveSquareIcon,
} from "@hugeicons/core-free-icons";

import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toggleSidebar, toggleActiveSection } from "../reducers/utilitiesReducers";

enum routes {
    Dashboard = "/",
    Income = "/income",
    Expenses = "/expenses",
    Savings = "/savings",
}

export type SectionType = keyof typeof routes;

type sidebarButtonProps = {
    icon: IconSvgElement;
    children: ReactNode;
    route: SectionType;
};

export default function Sidebar() {
    const [activeSection, setActiveSection] = useState<SectionType | null>(null);

    const sidebarOpen = useAppSelector((state) => state.utilities.sidebarOpen);
    const dispatch = useAppDispatch();

    const handleActiveSection = (section: SectionType) => {
        setActiveSection(section);
        dispatch(toggleSidebar());
        dispatch(toggleActiveSection(section));
    };

    useEffect(() => {
        //Get url subdirectory
        const url = window.location.pathname;
        const section = Object.keys(routes).find((key) => routes[key as keyof typeof routes] === url) as
            | SectionType
            | undefined;
        if (section) {
            handleActiveSection(section);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const SidebarButton = ({ icon, children, route }: sidebarButtonProps) => (
        <Link
            to={routes[route]}
            onClick={() => handleActiveSection(route)}
            className={`w-full flex items-center gap-2 border-0 py-1 text-white transition-all duration-300
        ${
            activeSection === route
                ? "border-r-custom-accent ps-6 border-r-[3px]"
                : "opacity-50 ps-3 bg-transparent hover:text-custom-accent hover:ps-6"
        }`}
        >
            <HugeiconsIcon size={23} icon={icon} />
            <h3 className="text-2xl xl:text-xl text-inherit">{children}</h3>
        </Link>
    );

    return (
        <div
            className={`fixed h-full xl:sticky xl:top-0 xl:left-0 overflow-hidden xl:visible w-dvw xl:w-fit xl:h-fit bg-black bg-opacity-65 xl:bg-opacity-50 z-50 ${
                sidebarOpen ? "visible" : "invisible"
            }`}
        >
            <div
                className={`bg-custom-ly1 py-5 xl:w-64 h-dvh relative transition-all duration-300 flex flex-col ${
                    sidebarOpen ? "w-5/6 md:w-2/5 lg:w-1/3" : "w-0"
                }`}
            >
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="h-12 p-0 w-12 right-0 translate-x-1/2 top-1/2 translate-y-[-50%] rounded-md bg-custom-accent flex items-center justify-center absolute text-white xl:hidden"
                >
                    <HugeiconsIcon size={35} icon={ArrowLeft01Icon} />
                </button>
                <div className="flex flex-col items-center mb-9 overflow-hidden">
                    <img className="w-28 max-w-none" src="/appLogo.png" alt="App Logo" />
                    <h2 className="text-4xl">AppName</h2>
                </div>

                <div className="flex flex-col gap-2 px-3 overflow-hidden">
                    <SidebarButton route={"Dashboard"} icon={DashboardSpeed01Icon}>
                        Dashboard
                    </SidebarButton>

                    <SidebarButton route={"Income"} icon={MoneyReceiveSquareIcon}>
                        Income
                    </SidebarButton>

                    <SidebarButton route={"Expenses"} icon={Invoice02Icon}>
                        Expenses
                    </SidebarButton>

                    <SidebarButton route={"Savings"} icon={MoneySavingJarIcon}>
                        Savings
                    </SidebarButton>
                </div>

                <div className="mt-auto px-6">
                    <div className="border-t-2 border-white py-2 overflow-hidden">
                        <p className="mb-2 text-base">Design and made by Max García</p>
                        <div className="flex gap-x-2">
                            <a
                                href="https://www.github.com/maxg02"
                                className="flex text-custom-accent"
                                target="_blank"
                            >
                                <HugeiconsIcon size={30} icon={Github01FreeIcons} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/max-daniel-garcia-sanchez-b9658a224/"
                                className="flex text-custom-accent"
                                target="_blank"
                            >
                                <HugeiconsIcon size={30} icon={Linkedin01FreeIcons} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
