import React from "react";
import type { ReactElement } from "react";

function SectionContent({ children }: { children: ReactElement[] }) {
    return <div className="flex-1 flex flex-col py-8 gap-4">{children}</div>;
}

export default SectionContent;
