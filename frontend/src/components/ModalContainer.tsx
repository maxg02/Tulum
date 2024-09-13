import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type modalBody = {
    closingHandler: () => {
        payload: undefined;
        type: "createModal/hideModal";
    };
    children: React.ReactNode;
    title: string;
};

function ModalContainer({ closingHandler, children, title }: modalBody) {
    return (
        <div className="absolute left-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex">
            <div className="bg-custom-ly1 m-auto w-[30%] infoContainer1 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)]">
                <div className="grid grid-cols-3 w-full">
                    <p className="col-start-2 m-auto">{title}</p>
                    <button
                        className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                        onClick={closingHandler}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <form className="flex flex-col gap-y-3 w-full">{children}</form>
            </div>
        </div>
    );
}

export default ModalContainer;
