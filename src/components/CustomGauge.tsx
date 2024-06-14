import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import React from "react";

function CustomGauge() {
    return (
        <Gauge
            value={90}
            innerRadius={"65%"}
            classes={{ referenceArc: "fill-[#343F3A]", valueArc: "fill-[url(#header-shape-gradient)]" }}
            sx={{
                [`& ${gaugeClasses.valueArc} `]: {
                    fill: "red",
                },
            }}
        >
            <defs>
                <linearGradient id="header-shape-gradient" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e66465" />
                    <stop offset="100%" stop-color="#9198e5" />
                </linearGradient>
            </defs>
        </Gauge>
    );
}

export default CustomGauge;
