import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleSidebar } from "../../reducers/utilitiesReducers";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

export default function Header() {
    const dispatch = useAppDispatch();
    const activeSection = useAppSelector((state) => state.utilities.activeSection);

    return (
        <div className="flex items-center">
            <button className="me-3 xl:hidden" onClick={() => dispatch(toggleSidebar())}>
                <HugeiconsIcon size={30} icon={Menu01Icon} />
            </button>
            <h1 className="text-3xl">{activeSection}</h1>
        </div>
    );
}
