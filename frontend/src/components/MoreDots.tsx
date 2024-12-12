import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamond } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export type SectionUrl = "/" | "/income" | "/expenses" | "/savings";

function MoreDots({ section }: { section: SectionUrl }) {
    return (
        <Link to={section}>
            <div className="text-xs flex gap-x-2 text-custom-accent p-1">
                <FontAwesomeIcon icon={faDiamond} size="xs" />
                <FontAwesomeIcon icon={faDiamond} size="xs" />
                <FontAwesomeIcon icon={faDiamond} size="xs" />
            </div>
        </Link>
    );
}

export default MoreDots;
