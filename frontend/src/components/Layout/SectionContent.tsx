import React from "react";
import type { ReactElement } from "react";
import Header from "./Header";

function SectionContent({ children }: { children: ReactElement }) {
    return (
        <div className="flex-1 flex justify-center p-4 md:p-8 xl:p-5 2xl:p-8 overflow-x-hidden">
            <div className="flex flex-col max-xl:h-fit flex-1 max-w-[2000px] gap-8 xl:gap-5 2xl:gap-8">
                <Header />
                {children}
            </div>
        </div>
    );
}

export default SectionContent;
