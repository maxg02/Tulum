import { HighlightItemData } from "@mui/x-charts/context/HighlightedProvider/HighlightedContext";
import { gradientColors } from "../../Constants/Colors";
import { PieChart } from "@mui/x-charts/PieChart";

export type pieChartSlice = {
    label: string;
    value: number;
};

function CustomPieChart({
    data,
    label,
    onHighlightChange,
}: {
    data: pieChartSlice[];
    label: number;
    onHighlightChange: ((highlightedItem: HighlightItemData | null) => void) | undefined;
}) {
    return (
        <div className="relative h-full w-full">
            <PieChart
                colors={gradientColors}
                margin={{ left: 0, right: 0 }}
                series={[
                    {
                        data: data.length > 0 ? data : [{ label: "No Data", value: 1 }],
                        id: "A",
                        innerRadius: "65%",
                        paddingAngle: 2,
                        cornerRadius: 3,
                        highlightScope: {
                            fade: "global",
                            highlight: data.length > 0 ? "item" : "none",
                        },
                        faded: { color: "gray", additionalRadius: -5 },
                        valueFormatter: (value) => `RD$${value.value}`,
                    },
                ]}
                onHighlightChange={onHighlightChange}
                slotProps={{ legend: { hidden: true } }}
                sx={{
                    "& .MuiPieArc-root": { strokeWidth: 0 },
                }}
                tooltip={{
                    trigger: data.length > 0 ? "item" : "none",
                    classes: {
                        labelCell: "hidden",
                        valueCell: "ml-3 p-3",
                        markCell: "pl-3 pr-0",
                    },
                }}
            ></PieChart>
            <h2 className="font-light text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                RD${label}
            </h2>
        </div>
    );
}

export default CustomPieChart;
