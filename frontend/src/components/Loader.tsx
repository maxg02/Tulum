import React from "react";

function Loader() {
    return (
        <div className="w-full h-full flex">
            <div className="my-auto mx-auto h-12 rounded-full border-8 border-custom-accent/40 border-t-custom-accent aspect-square animate-spin"></div>
        </div>
    );
}

export default Loader;
