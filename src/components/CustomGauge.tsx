import { Gauge, useGaugeState, gaugeClasses } from "@mui/x-charts/Gauge";
import React from "react";
import { basicColors } from "../components/Colors";

function CustomGauge({ value }: { value: number }) {
    const GaugeGradient = () => {
        const { cx, cy, outerRadius, innerRadius, valueAngle, maxRadius } = useGaugeState();

        return (
            <g>
                <defs>
                    <clipPath id="cut-bottom">
                        <rect
                            x={cx}
                            y={cy - maxRadius}
                            width={maxRadius}
                            height={cy - outerRadius * Math.cos(valueAngle)}
                            id={`${valueAngle}`}
                        />
                    </clipPath>
                    <mask id="inner-mask">
                        <rect
                            x={cx}
                            y={cy - maxRadius}
                            width={maxRadius}
                            height={maxRadius * 2}
                            fill="white"
                        />
                        <circle cx={cx} cy={cy} r={innerRadius} fill="black" />
                    </mask>
                    <linearGradient id="gradient" x1="0" y1="0.90" x2="0" y2="-0.50">
                        <stop stop-color={basicColors.secondary} offset="0%"></stop>
                        <stop stop-color={basicColors.accent} offset="50%"></stop>
                    </linearGradient>
                </defs>
                <circle
                    cx={cx}
                    cy={cy}
                    r={outerRadius}
                    fill="url(#gradient)"
                    clipPath="url(#cut-bottom)"
                    mask="url(#inner-mask)"
                />
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
                <GaugeGradient />
            </Gauge>
        </div>
    );
}

export default CustomGauge;
