import { Gauge, useGaugeState, gaugeClasses } from "@mui/x-charts/Gauge";
import React from "react";
import { v4 as id } from "uuid";
import { basicColors } from "../components/Colors";

function CustomGauge({ value }: { value: number }) {
    const GaugeGradient = () => {
        const { cx, cy, outerRadius, innerRadius, maxRadius } = useGaugeState();

        const gradientValue = value! * 4 > 100 ? 100 : value! * 4;
        const gradientHeight = maxRadius * (gradientValue / 100);

        return (
            <g>
                <defs>
                    <mask id="inner-mask">
                        <rect
                            x={cx}
                            y={cy - maxRadius}
                            width={maxRadius}
                            height={gradientHeight}
                            fill="white"
                        />
                        <circle cx={cx} cy={cy} r={innerRadius} fill="black" />
                    </mask>
                    <linearGradient id="gradient" x1="0" y1="0.50" x2="0" y2="-0.20">
                        <stop stop-color={basicColors.secondary} offset="0%"></stop>
                        <stop stop-color={basicColors.accent} offset="50%"></stop>
                    </linearGradient>
                </defs>
                <circle cx={cx} cy={cy} r={outerRadius} fill={"red"} mask="url(#inner-mask)" />
            </g>
        );
    };

    return (
        <div className="h-full w-full relative">
            <Gauge
                value={value}
                innerRadius={"65%"}
                classes={{ referenceArc: "fill-[#343F3A]", valueArc: "fill-[#69AA95]" }}
                sx={{
                    [`& ${gaugeClasses.valueArc} `]: {
                        fill: "red",
                    },
                }}
            >
                <GaugeGradient key={id()} />
            </Gauge>
        </div>
    );
}

export default CustomGauge;
