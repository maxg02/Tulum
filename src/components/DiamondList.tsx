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

function DiamondList({
    items,
    highlightedItem,
}: {
    items: string[];
    highlightedItem: { dataIndex: number; seriesId: string } | undefined | null;
}) {
    const ListItems = () =>
        items.map((item, key) => (
            <li className={`flex gap-x-3 items-center mb-1 last:mb-0 text-lg`}>
                <FontAwesomeIcon
                    className={`${
                        key === highlightedItem?.dataIndex ? "text-custom-accent" : textColorClasses[key]
                    } stroke-icon`}
                    icon={faDiamond}
                />
                <p
                    className={`${
                        key === highlightedItem?.dataIndex ? "text-custom-accent" : ""
                    } text-sm`}
                >
                    {item}
                </p>
            </li>
        ));

    return (
        <ul>
            <ListItems />
        </ul>
    );
}

export default DiamondList;
