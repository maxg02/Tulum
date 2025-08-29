import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { DiamondIcon } from "@hugeicons/core-free-icons";
import { SectionUrl } from "@/types/types";

function MoreDots({ section, className }: { section: SectionUrl; className?: string }) {
    return (
        <Link className={`${className}`} to={section}>
            <div className="flex gap-x-2 text-custom-accent p-1">
                <HugeiconsIcon icon={DiamondIcon} strokeWidth={3} size={12} />
                <HugeiconsIcon icon={DiamondIcon} strokeWidth={3} size={12} />
                <HugeiconsIcon icon={DiamondIcon} strokeWidth={3} size={12} />
            </div>
        </Link>
    );
}

export default MoreDots;
