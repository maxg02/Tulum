import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

type buttonProps = {
    isLoading: boolean;
    isSuccess: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function CustomButton({ isLoading, isSuccess, onClick, children, className }: buttonProps) {
    return (
        <button className={className} onClick={onClick} disabled={isLoading}>
            {isLoading ? (
                <div className="my-auto mx-auto h-[1lh] rounded-full border-4 border-custom-accent/40 border-t-custom-accent aspect-square animate-spin"></div>
            ) : isSuccess ? (
                <HugeiconsIcon size={23} icon={CheckmarkCircle02Icon} className="mx-auto" />
            ) : (
                children
            )}
        </button>
    );
}

export default CustomButton;
