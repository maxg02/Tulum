import { Gauge, useGaugeState } from "@mui/x-charts/Gauge";
import { v4 as id } from "uuid";
import { basicColors } from "../components/Colors";

function CustomGauge({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
    const gradientClipId = id();
    const maskClipId = id();

    const GaugeGradient = () => {
        const { cx, cy, outerRadius, innerRadius, maxRadius, valueAngle, startAngle } = useGaugeState();
        const valueAngle50 = valueAngle! > Math.PI ? Math.PI : valueAngle!;

        const target = {
            xo: cx + outerRadius * Math.sin(valueAngle50),
            yo: cy - outerRadius * Math.cos(valueAngle50),
            xi: cx + innerRadius * Math.sin(valueAngle50),
            yi: cy - innerRadius * Math.cos(valueAngle50),
            xso: cx + outerRadius * Math.sin(startAngle!),
            yso: cy - outerRadius * Math.cos(startAngle!),
            xsi: cx + innerRadius * Math.sin(startAngle!),
            ysi: cy - innerRadius * Math.cos(startAngle!),
        };

        return (
            <g>
                <clipPath id={gradientClipId}>
                    <path
                        d={`M ${target.xi} ${target.yi} L ${target.xo} ${target.yo} A ${outerRadius} ${outerRadius} 0 0 0 ${target.xso} ${target.yso} L ${target.xsi} ${target.ysi} A ${innerRadius} ${innerRadius} 0 0 1 ${target.xi} ${target.yi}`}
                    />
                </clipPath>

                <foreignObject
                    x={cx - maxRadius}
                    y={cy - maxRadius}
                    width={maxRadius * 2}
                    height={maxRadius * 2}
                    clip-path={`url(#${gradientClipId})`}
                >
                    <div
                        className="h-full w-full bg-red-500 rounded-full"
                        style={{
                            backgroundImage: `conic-gradient(${basicColors.accent} 0%, ${basicColors.secondary} 50%)`,
                        }}
                    />
                </foreignObject>
            </g>
        );
    };

    const GaugeInnerBorder = () => {
        const { cx, cy, innerRadius } = useGaugeState();

        return (
            <g>
                <defs>
                    <mask id={maskClipId}>
                        <circle cx={cx} cy={cy} r={innerRadius} fill="white" />
                    </mask>
                </defs>

                <circle
                    cx={cx}
                    cy={cy}
                    r={innerRadius}
                    stroke={basicColors.primary}
                    strokeWidth={10}
                    mask={`url(#${maskClipId})`}
                    fill="transparent"
                />
            </g>
        );
    };

    return (
        <div className="h-full w-full relative">
            <Gauge
                value={value}
                innerRadius={"65%"}
                classes={{
                    referenceArc: "fill-[#343F3A]",
                    valueArc: "fill-[#69AA95]",
                    valueText: "hidden",
                }}
            >
                <GaugeGradient />
                <GaugeInnerBorder />
            </Gauge>
            <p
                className={`${
                    accent ? "text-custom-accent" : ""
                } text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
            >
                {label}
            </p>
        </div>
    );
}

export default CustomGauge;
