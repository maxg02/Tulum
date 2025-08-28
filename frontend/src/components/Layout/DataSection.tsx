import React from "react";
import Loader from "../Misc/Loader";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon } from "@hugeicons/core-free-icons";

type dataSectionProps = {
    children: React.ReactNode;
    isLoading: boolean;
    isEmpty: boolean | null;
    createFunction: () => void | null;
    title: string;
};

function DataSection({ children, isLoading, isEmpty, createFunction, title }: dataSectionProps) {
    return (
        <>
            <div className="flex justify-center relative w-full">
                <p className="text-nowrap">{title}</p>
                {createFunction && (
                    <button
                        className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                        onClick={createFunction}
                    >
                        <HugeiconsIcon icon={AddSquareIcon} size={20} className="text-custom-accent" />
                    </button>
                )}
            </div>
            {isLoading ? (
                <Loader />
            ) : isEmpty ? (
                <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full justify-self-center">
                    <p>Press</p>
                    <HugeiconsIcon icon={AddSquareIcon} size={20} className="text-custom-accent" />
                    <p>to add {title.toLocaleLowerCase()}</p>
                </div>
            ) : (
                children
            )}
        </>
    );
}

export default DataSection;
