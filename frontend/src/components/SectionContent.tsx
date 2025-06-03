import React from "react";
import type { ReactElement } from "react";
import Header from "./Header";

function SectionContent({ children }: { children: ReactElement }) {
    return (
        <div className="flex-1 flex justify-center p-4 md:p-8 overflow-x-hidden">
            <div className="flex flex-col max-2xl:h-fit flex-1 max-w-[2000px] gap-8">
                <Header currentSection="Dashboard" />
                {children}
            </div>
        </div>
    );
}

export default SectionContent;
