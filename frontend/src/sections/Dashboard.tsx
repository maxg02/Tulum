import React, { ReactNode, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import MoreDots from "../components/MoreDots";
import { LineChart, markElementClasses } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { gradientColors } from "../components/Colors";
import DiamondList from "../components/DiamondList";
import CustomGauge from "../components/CustomGauge";
import {
    expenseDto,
    goalContributionDto,
    incomeDto,
    useGetUserExpenseCategoriesQuery,
    useGetUserIncomesQuery,
    useGetSavingGoalsByUserIdQuery,
    useGetUserExpensesQuery,
} from "../../api/apiSlice";
import Loader from "../components/Loader";
import { DiamondIcon, Invoice02Icon, MoneyReceiveSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { axisClasses } from "@mui/x-charts/ChartsAxis/axisClasses";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { monthList } from "../components/Constants";

export type pieChartSlice = {
    label: string;
    value: number;
};

export default function Dashboard() {
    const [highlightedValue, setHighlightedValue] = useState(null);

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    let dataLineChart: {
            name: string;
            inc: number;
            exp: number;
        }[] = [],
        lineChartMaxValue: number = 0,
        totalMonthIncome: number = 0,
        monthIncomeRows: JSX.Element[] = [],
        monthExpenseRows: JSX.Element[] = [],
        monthExpensesData: pieChartSlice[] = [],
        goalsProgressData: { label: string; progress: number; value: number }[] = [];

    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetUserExpenseCategoriesQuery();
    const { data: expenseData, isLoading: expenseIsLoading } = useGetUserExpensesQuery();
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetSavingGoalsByUserIdQuery(1);

    if (
        !incomeIsLoading &&
        incomeData != undefined &&
        !expenseCategoryIsLoading &&
        expenseCategoryData != undefined &&
        !savingGoalIsLoading &&
        savingGoalData != undefined &&
        !expenseIsLoading &&
        expenseData != undefined
    ) {
        const monthExpenses = expenseData?.filter(
            (expense) =>
                new Date(expense.date).getMonth() === currentDate.getMonth() &&
                new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

        const yearIncomes = incomeData.filter(
            (income) => new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        const monthIncomes = incomeData.filter(
            (income) =>
                new Date(income.date).getMonth() === currentDate.getMonth() &&
                new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        totalMonthIncome = monthIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);

        const yearExpenses = expenseData?.filter(
            (expense) => new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

        dataLineChart = monthList.map((month) => ({
            name: month,
            inc: yearIncomes
                .filter(
                    (income: incomeDto) =>
                        new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                            new Date(income.date)
                        ) == month
                )
                .reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
            exp: yearExpenses
                .filter(
                    (expense: expenseDto) =>
                        new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                            new Date(expense.date)
                        ) == month
                )
                .reduce((acc: number, next: expenseDto) => acc + next.amount, 0),
        }));

        const preLineChartMaxValue = Math.max(
            ...dataLineChart.map((data) => data.inc),
            ...dataLineChart.map((data) => data.exp)
        );
        lineChartMaxValue =
            (preLineChartMaxValue + (1000 - (preLineChartMaxValue % 1000))) % 2000 === 0
                ? preLineChartMaxValue + (1000 - (preLineChartMaxValue % 1000))
                : preLineChartMaxValue + (1000 - (preLineChartMaxValue % 1000)) + 1000;

        monthIncomeRows = monthIncomes
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .reverse()
            .slice(0, 3)
            .map((income: incomeDto, key) => {
                const dateFormat = new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    weekday: "long",
                }).formatToParts(new Date(income.date));
                return (
                    <div key={key} className="flex justify-between">
                        <p>
                            ({dateFormat.find((p) => p.type === "day")?.value}{" "}
                            {dateFormat.find((p) => p.type === "weekday")?.value}) {income.details}
                        </p>
                        <p className="text-custom-accent">RD${income.amount}</p>
                    </div>
                );
            });

        monthExpenseRows = monthExpenses
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .reverse()
            .slice(0, 3)
            .map((expense: expenseDto, key) => {
                const dateFormat = new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    weekday: "long",
                }).formatToParts(new Date(expense.date));
                return (
                    <div key={key} className="flex justify-between">
                        <p>
                            ({dateFormat.find((p) => p.type === "day")?.value}{" "}
                            {dateFormat.find((p) => p.type === "weekday")?.value}) {expense.details}
                        </p>
                        <p className="text-custom-accent">RD${expense.amount}</p>
                    </div>
                );
            });

        const monthExpensesByCategory: object = Object.groupBy(
            monthExpenses,
            (expense: expenseDto) => expense.expenseCategoryId
        );

        monthExpensesData = Object.keys(monthExpensesByCategory).map<pieChartSlice>((key) => ({
            label:
                key != "null"
                    ? expenseCategoryData?.find((c) => c.id === parseInt(key))!.category
                    : "Otros",
            value: monthExpensesByCategory[key].reduce((acc, expense) => acc + expense.amount, 0),
        }));

        const allGoalContributions = savingGoalData
            ?.map((sG) => sG.goalContributions)
            .reduce((acc, currentValue) => acc!.concat(currentValue!), []);

        const goalContributionsBySavings: object = Object.groupBy(
            allGoalContributions,
            (gC: goalContributionDto) => gC.savingGoalId
        );

        goalsProgressData = savingGoalData
            .map((sg) => {
                const progress = goalContributionsBySavings[sg.id.toString()]
                    ? goalContributionsBySavings[sg.id.toString()].reduce(
                          (acc: number, gC: goalContributionDto) => acc + gC.amount,
                          0
                      )
                    : 0;

                return {
                    label: sg!.details,
                    progress: progress,
                    value: (progress * 100) / sg!.goal,
                };
            })
            .sort((a, b) => a.value - b.value)
            .reverse();
    }

    const goalsProgressGauges = goalsProgressData.slice(0, 3).map((gp) => (
        <div className="flex flex-col items-center basis-1/3 md:basis-1/4">
            <div className="w-full aspect-square mb-1">
                <CustomGauge value={gp.value} label={`${Math.round(gp.value)}%`} />
            </div>
            <p>{gp.label}</p>
        </div>
    ));

    const dataPieChart: pieChartSlice[] = monthExpensesData;

    return (
        <SectionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-11 gap-8 overflow-x-hidden overflow-y-auto auto-rows-auto 2xl:grid-rows-11 2xl:flex-1 max-h-[1200px]">
                <div className="flex flex-col gap-6 border-b-2 md:hidden">
                    <p className="self-center">{currentMonth} Balance</p>
                    <div className="flex gap-9 px-4 mb-8">
                        <div className="flex justify-center items-center bg-custom-ly1 containerShadow rounded-2xl flex-1 py-5">
                            <HugeiconsIcon className={"me-2"} icon={MoneyReceiveSquareIcon} size={30} />
                            <h1 className="font-light text-xl">RD$50000</h1>
                        </div>
                        <div className="flex justify-center items-center bg-custom-ly2 rounded-2xl flex-1">
                            <HugeiconsIcon className={"me-2"} icon={Invoice02Icon} size={30} />
                            <h1 className="font-light text-xl">RD${totalMonthIncome}</h1>
                        </div>
                    </div>
                </div>

                <div className="infoContainer1 hidden md:flex 2xl:row-span-5 2xl:col-span-5">
                    <div className="grid grid-cols-3 w-full">
                        <p className="col-start-2 mx-auto">{currentMonth} Income</p>
                        <div className="ml-auto">
                            <MoreDots section="/income" />
                        </div>
                    </div>
                    <h1 className="font-light text-5xl my-auto">RD${totalMonthIncome}</h1>
                    <div className="2xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                        {monthIncomeRows}
                    </div>
                </div>

                <div className="infoContainer2 flex-1 hidden md:flex 2xl:row-span-6 2xl:col-span-6">
                    <div className="grid grid-cols-3 w-full">
                        <p className="col-start-2 mx-auto">{currentMonth} Expenses</p>
                        <div className="ml-auto">
                            <MoreDots section="/expenses" />
                        </div>
                    </div>
                    <div className="w-full flex-1 flex items-center justify-center gap-x-8 xl:justify-evenly xl:gap-x-0 overflow-y-hidden">
                        <div className="w-full xl:w-[45%] 2xl:w-auto 2xl:h-full aspect-square relative">
                            {expenseCategoryIsLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    <PieChart
                                        colors={[
                                            gradientColors[0],
                                            gradientColors[1],
                                            gradientColors[2],
                                            gradientColors[3],
                                            gradientColors[4],
                                        ]}
                                        margin={{ left: 0, right: 0 }}
                                        series={[
                                            {
                                                data:
                                                    dataPieChart.length > 0
                                                        ? dataPieChart
                                                        : [{ label: "No Data", value: 1 }],
                                                id: "A",
                                                innerRadius: "65%",
                                                paddingAngle: 2,
                                                cornerRadius: 3,
                                                highlightScope: {
                                                    fade: "global",
                                                    highlight: dataPieChart.length > 0 ? "item" : "none",
                                                },
                                                faded: { color: "gray", additionalRadius: -5 },
                                                valueFormatter: (value) => `RD$${value.value}`,
                                            },
                                        ]}
                                        onHighlightChange={setHighlightedValue}
                                        slotProps={{ legend: { hidden: true } }}
                                        sx={{
                                            "& .MuiPieArc-root": { strokeWidth: 0 },
                                        }}
                                        tooltip={{
                                            trigger: dataPieChart.length > 0 ? "item" : "none",
                                            classes: {
                                                labelCell: "hidden",
                                                valueCell: "ml-3 p-3",
                                                markCell: "pl-3 pr-0",
                                            },
                                        }}
                                    ></PieChart>
                                    <h2 className="font-light text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        {`RD$${dataPieChart.reduce(
                                            (acc, currentValue) => (acc = acc + currentValue.value),
                                            0
                                        )}`}
                                    </h2>
                                </>
                            )}
                        </div>
                        {dataPieChart.length > 0 && (
                            <DiamondList
                                items={dataPieChart.map((x) => x.label)}
                                highlightedItem={highlightedValue}
                            />
                        )}
                    </div>
                    <div className="2xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                        {monthExpenseRows}
                    </div>
                </div>

                <div className="infoContainer2 md:col-span-2 2xl:row-span-6 2xl:col-span-5">
                    <p>{currentDate.getFullYear()} Summary</p>
                    <div className="w-full h-40 md:h-52 2xl:h-4/6">
                        {incomeIsLoading || expenseCategoryIsLoading ? (
                            <Loader />
                        ) : (
                            <LineChart
                                margin={{ left: 35, right: 10, top: 15, bottom: 20 }}
                                xAxis={[
                                    {
                                        dataKey: "name",
                                        scaleType: "point",
                                    },
                                ]}
                                yAxis={[
                                    {
                                        min: 0,
                                        domainLimit: "nice",
                                        valueFormatter: (value) =>
                                            value < 1000 ? value : `${value / 1000}K`,
                                    },
                                ]}
                                series={[
                                    {
                                        dataKey: "inc",
                                        label: "Income",
                                        color: "#78d2b5",
                                        curve: "linear",
                                        valueFormatter: (value) =>
                                            value == null ? "RD$0" : `RD$${value}`,
                                    },

                                    {
                                        dataKey: "exp",
                                        label: "Expenses",
                                        color: "#d96533",
                                        curve: "linear",
                                        valueFormatter: (value) =>
                                            value == null ? "RD$0" : `RD$${value}`,
                                    },
                                ]}
                                dataset={dataLineChart}
                                grid={{ vertical: true, horizontal: true }}
                                slotProps={{ legend: { hidden: true } }}
                                sx={{
                                    [`& .${markElementClasses.root}`]: {
                                        scale: "0.9",
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
                                }}
                            />
                        )}
                    </div>
                    <div className="flex gap-6">
                        <div className="flex flex-col items-center gap-1">
                            <HugeiconsIcon icon={DiamondIcon} size={15} strokeWidth={3} color="#78d2b5" />
                            <p>Income</p>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <HugeiconsIcon icon={DiamondIcon} size={15} strokeWidth={3} color="#d96533" />
                            <p>Expenses</p>
                        </div>
                    </div>
                </div>

                <div className="infoContainer1 md:col-span-2 2xl:row-span-5 2xl:col-span-6">
                    <div className="grid grid-cols-3 w-full">
                        <p className="col-start-2 mx-auto">Saving Goals</p>
                        <div className="ml-auto">
                            <MoreDots section="/savings" />
                        </div>
                    </div>
                    <div className="w-full flex-1 flex items-center justify-evenly flex-wrap">
                        {savingGoalIsLoading ? <Loader /> : goalsProgressGauges}
                    </div>
                </div>
            </div>
        </SectionContent>
    );
}
