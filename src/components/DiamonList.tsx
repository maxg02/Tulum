import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiamond } from "@fortawesome/free-solid-svg-icons";

const textColorClasses = [
    "text-gradient-1",
    "text-gradient-2",
    "text-gradient-3",
    "text-gradient-4",
    "text-gradient-5",
];

function DiamondList({ items }: { items: [string, string, string, string, string] }) {
    const ListItems = () =>
        items.map((item, key) => (
            <li className={`flex gap-x-3 items-center mb-3 last:mb-0 text-xl`}>
                <FontAwesomeIcon
                    size="lg"
                    className={`${textColorClasses[key]} stroke-icon`}
                    icon={faDiamond}
                />
                <p className="text-sm">{item}</p>
            </li>
        ));

    return (
        <ul>
            <ListItems />
        </ul>
    );
}

export default DiamondList;
