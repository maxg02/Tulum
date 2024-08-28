import React from "react";

function Modal() {
    return (
        <div className="absolute left-0 h-[100vh] w-[100vw] bg-black bg-opacity-40 flex">
            <div className="bg-custom-ly1 m-auto w-[30%] h-[50%] infoContainer1 shadow-[0_0_5px_1px_rgba(0,0,0,0.35)]">
                <p>Create Income</p>
            </div>
        </div>
    );
}

export default Modal;
