import { AlertCircleIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

function Error({ error }: { error: string }) {
    return (
        <div className="mb-2 bg-white border-l-4 border-red-500 shadow-lg z-50 rounded-md flex items-center">
            <div className="p-2">
                <HugeiconsIcon size={30} className="text-red-500" icon={AlertCircleIcon} />
            </div>
            <span className="text-red-400 p-1 ps-0">{error}</span>
            <div
                className="p-2 ms-auto cursor-pointer text-gray-400 hover:text-gray-500"
                onClick={(e) => e.currentTarget.parentElement?.remove()}
            >
                <HugeiconsIcon size={15} strokeWidth={2} icon={Cancel01Icon} />
            </div>
        </div>
    );
}

function ErrorMessage({ error }: { error: string[] }) {
    const Errors = () =>
        error.map((err, index) => (
            <div
                key={index}
                style={{
                    transform: `translateY(-30px)`,
                    opacity: 0,
                    animationDelay: `${index * 0.1}s`,
                }}
                className="slideIn"
            >
                <Error error={err} />
            </div>
        ));

    return (
        <div className="fixed top-0 right-0 p-4 w-full md:w-[30rem]">
            <Errors />
        </div>
    );
}

export default React.memo(ErrorMessage);
