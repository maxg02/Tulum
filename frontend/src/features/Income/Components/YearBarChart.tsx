import { BarChart } from "@mui/x-charts/BarChart";
import { dataYearBarChart } from "../types";
import { basicColors } from "@/Constants/Colors";
import { axisClasses, chartsAxisHighlightClasses, chartsGridClasses } from "@mui/x-charts";

function YearBarChart({ dataBarChart }: { dataBarChart: dataYearBarChart }) {
    return (
        <BarChart
            dataset={dataBarChart}
            borderRadius={5}
            barLabel={(item) =>
                item.value ?? 0 > 1000 ? `${(item.value! / 1000).toFixed(2)}K` : `${item.value}`
            }
            margin={{ left: 0 }}
            xAxis={[
                {
                    valueFormatter: (value: number) => (value > 1000 ? `${value / 1000}K` : `${value}`),
                    domainLimit: "strict",
                },
            ]}
            yAxis={[{ scaleType: "band", dataKey: "month", width: 35 }]}
            series={[
                {
                    dataKey: "income",
                    valueFormatter: (v) => `RD$${v}`,
                    color: basicColors.secondary,
                },
            ]}
            layout="horizontal"
            grid={{ vertical: true }}
            sx={{
                [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: "white",
                        strokeWidth: 2,
                        opacity: 0.3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                        fill: "white",
                        opacity: 0.5,
                    },
                },
                [`.${chartsAxisHighlightClasses.root}`]: {
                    fill: "white",
                    stroke: "white",
                    opacity: 0.5,
                },
                "& .MuiBarLabel-root": {
                    fill: "white",
                    fontFamily: "Karla, sans-serif",
                },
                [`.${chartsGridClasses.line}`]: {
                    fill: "white",
                    stroke: "white",
                    opacity: 0.1,
                },
            }}
        />
    );
}

export default YearBarChart;
