import { DiamondIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const textColorClasses = [
    "text-gradient-1",
    "text-gradient-2",
    "text-gradient-3",
    "text-gradient-4",
    "text-gradient-5",
];
//TODO fix diamonds inconsistent size

function DiamondList({
    items,
    highlightedItem,
}: {
    items: string[];
    highlightedItem: { dataIndex: number; seriesId: string } | undefined | null;
}) {
    const ListItems = () =>
        items.map((item, key) => (
            <li className={`flex gap-x-3 items-center mb-2 last:mb-0 text-lg`}>
                <HugeiconsIcon
                    className={`${
                        key === highlightedItem?.dataIndex ? "text-custom-accent" : textColorClasses[key]
                    }`}
                    icon={DiamondIcon}
                    strokeWidth={4}
                    size={15}
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
