import { useDrawingArea } from "@mui/x-charts/hooks";
import { gradientColors } from "../../Constants/Colors";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";
import { ChartsLabelCustomMarkProps } from "@mui/x-charts/ChartsLabel";
import { MakeOptional } from "@mui/x-charts/internals";
import { PieValueType } from "@mui/x-charts/models/seriesType/pie";

export type pieChartSlice = MakeOptional<PieValueType, "id">;

const StyledText = styled("text")(({ theme }) => ({
    fill: ["#ffffff"],
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

function CustomPieChart({ data, label }: { data: pieChartSlice[]; label: number }) {
    return (
        <PieChart
            colors={gradientColors}
            series={[
                {
                    data: data.length > 0 ? data : [{ label: "No Data", value: 1 }],
                    id: "A",
                    innerRadius: "70%",
                    paddingAngle: 2,
                    cornerRadius: 3,
                    highlightScope: {
                        fade: "global",
                        highlight: data.length > 0 ? "item" : "none",
                    },
                    faded: { color: "gray", additionalRadius: -5 },
                    valueFormatter: (value) => `RD$${value.value}`,
                    labelMarkType: "circle",
                },
            ]}
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
        >
            <PieCenterLabel>RD${label}</PieCenterLabel>
        </PieChart>
    );
}

export default CustomPieChart;
