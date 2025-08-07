import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

type modalBody = {
    closingHandler: () => void;
    children: React.ReactNode;
    title: string;
};

function ModalContainer({ closingHandler, children, title }: modalBody) {
    return (
        <div className="absolute left-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex px-4 z-20">
            <div className="bg-custom-ly1 m-auto w-full max-w-96 infoContainer1 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)]">
                <div className="flex justify-center relative w-full">
                    <p className="text-nowrap">{title}</p>
                    <button
                        className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                        onClick={closingHandler}
                    >
                        <HugeiconsIcon
                            size={20}
                            strokeWidth={2}
                            icon={Cancel01Icon}
                            className="text-custom-accent"
                        />
                    </button>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-3 w-full">
                    {children}
                </form>
            </div>
        </div>
    );
}

export default ModalContainer;
