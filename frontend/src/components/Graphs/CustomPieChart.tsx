import { useDrawingArea } from "@mui/x-charts/hooks";
import { gradientColors } from "@/Constants/Colors";
import { PieChart } from "@mui/x-charts/PieChart";
import { styled } from "@mui/material/styles";

export type pieChartSlice = {
    label: string;
    value: number;
};

const StyledText = styled("text")(() => ({
    fill: ["#ffffff"],
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
    fontFamily: "Karla, sans-serif",
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

function CustomPieChart({ data, total }: { data: pieChartSlice[]; total: number }) {
    const topData = data.slice(0, 4);
    const otherData = total - topData.reduce((acc, val) => acc + val.value, 0);

    const pieChartData =
        otherData > 0
            ? [
                  ...topData,
                  {
                      label: "Others",
                      value: otherData,
                  },
              ]
            : topData;

    return (
        <PieChart
            colors={gradientColors}
            series={[
                {
                    data: pieChartData.length > 0 ? pieChartData : [{ label: "No Data", value: 1 }],
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
            slotProps={{
                legend: {
                    sx: { color: "white", fontSize: 13, fontFamily: "Karla, sans-serif" },
                },
                tooltip: {
                    trigger: data.length > 0 ? "item" : "none",
                    classes: {
                        valueCell: "ml-3 p-3",
                    },
                },
            }}
            sx={{
                "& .MuiPieArc-root": { strokeWidth: 0 },
            }}
        >
            <PieCenterLabel>RD${total}</PieCenterLabel>
        </PieChart>
    );
}

export default CustomPieChart;
