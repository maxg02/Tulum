import React, { useState } from "react";

function useModal(): [boolean, () => void] {
    const [isShowing, setIsShowing] = useState(false);

    function toggle() {
        setIsShowing(!isShowing);
    }

    return [isShowing, toggle];
}

export default useModal;
