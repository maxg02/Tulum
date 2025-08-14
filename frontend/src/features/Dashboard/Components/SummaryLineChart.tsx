import { axisClasses, chartsGridClasses } from "@mui/x-charts";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { LineChart, markElementClasses } from "@mui/x-charts/LineChart";
import { dataSummaryLineChart } from "../types";

function GoalProgressGauges({ dataLineChart }: { dataLineChart: dataSummaryLineChart }) {
    return (
        <LineChart
            xAxis={[
                {
                    dataKey: "month",
                    scaleType: "point",
                },
            ]}
            margin={{ left: 0, top: 20, bottom: 0, right: 10 }}
            yAxis={[
                {
                    min: 0,
                    domainLimit: "nice",
                    valueFormatter: (value: number) =>
                        value < 1000 ? value.toString() : `${value / 1000}K`,
                    width: 40,
                },
            ]}
            series={[
                {
                    dataKey: "inc",
                    label: "Income",
                    color: "#78d2b5",
                    curve: "linear",
                    valueFormatter: (value) => (value == null ? "RD$0" : `RD$${value}`),
                    labelMarkType: "circle",
                },
                {
                    dataKey: "exp",
                    label: "Expenses",
                    color: "#d96533",
                    curve: "linear",
                    valueFormatter: (value) => (value == null ? "RD$0" : `RD$${value}`),
                    labelMarkType: "circle",
                },
            ]}
            dataset={dataLineChart}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
                legend: {
                    position: {
                        horizontal: "center",
                        vertical: "bottom",
                    },
                    sx: {
                        color: "white",
                        fontSize: 13,
                        fontFamily: "Karla, sans-serif",
                    },
                },
            }}
            sx={{
                [`& .${markElementClasses.root}`]: {
                    fill: "#394942",
                    strokeWidth: 2,
                },
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
                [`.${chartsGridClasses.line}`]: {
                    fill: "white",
                    stroke: "white",
                    opacity: 0.1,
                },
            }}
        />
    );
}

export default GoalProgressGauges;
