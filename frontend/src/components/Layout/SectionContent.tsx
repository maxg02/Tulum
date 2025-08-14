import type { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "@/Hooks/stateHooks";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { toggleSidebar } from "@/reducers/utilitiesReducers";

function SectionContent({ children }: { children: ReactElement }) {
    const dispatch = useAppDispatch();
    const activeSection = useAppSelector((state) => state.utilities.activeSection);

    return (
        <div className="flex-1 flex justify-center p-4 md:p-8 xl:p-5 2xl:p-8 overflow-x-hidden">
            <div className="flex flex-col max-xl:h-fit flex-1 max-w-[2000px] gap-8 xl:gap-5 2xl:gap-8">
                {/*Header*/}
                <div className="flex items-center">
                    <button className="me-3 xl:hidden" onClick={() => dispatch(toggleSidebar())}>
                        <HugeiconsIcon size={30} icon={Menu01Icon} />
                    </button>
                    <h1 className="text-3xl">{activeSection}</h1>
                </div>
                {children}
            </div>
        </div>
    );
}

export default SectionContent;
