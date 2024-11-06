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
    useGetExpenseCategoryFullByUserIdQuery,
    useGetIncomesByUserIdQuery,
    useGetSavingGoalsByUserIdQuery,
} from "../../api/apiSlice";
import Loader from "../components/Loader";

export type pieChartSlice = {
    label: string;
    value: number;
};

const dataPieChart: pieChartSlice[] = [
    {
        label: "Food",
        value: 20000,
    },
    {
        label: "Transport",
        value: 2000,
    },
    {
        label: "House/Utilities",
        value: 14000,
    },
    {
        label: "Personal/Medical",
        value: 12000,
    },
    {
        label: "Others",
        value: 2500,
    },
];

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

    const { data: incomeData, isLoading: incomeIsLoading } = useGetIncomesByUserIdQuery(1);
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetExpenseCategoryFullByUserIdQuery(1);
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetSavingGoalsByUserIdQuery(1);

    const monthList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    if (
        !incomeIsLoading &&
        incomeData != undefined &&
        !expenseCategoryIsLoading &&
        expenseCategoryData != undefined &&
        !savingGoalIsLoading &&
        savingGoalData != undefined
    ) {
        const allExpenses = expenseCategoryData
            .map((ec) => ec.expenses)
            .reduce((acc, currentValue) => acc!.concat(currentValue!), []);

        const monthExpenses = allExpenses.filter(
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

        const yearExpenses = allExpenses?.filter(
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
            label: expenseCategoryData?.find((c) => c.id === parseInt(key))!.category,
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
        <div className=" h-full flex flex-col items-center w-44">
            <div className="flex-1 w-full mb-1">
                <CustomGauge value={gp.value} label={`${Math.round(gp.value)}%`} accent />
            </div>
            <p>{gp.label}</p>
        </div>
    ));

    const dataPieChart: pieChartSlice[] = monthExpensesData;

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Dashboard" />
            <SectionContent>
                <Header currentSection="Dashboard" />
                <div className="flex-1 flex overflow-hidden gap-x-9">
                    <div className="flex flex-col flex-1 gap-y-9">
                        <div className="infoContainer1">
                            <p>{currentMonth} Income</p>
                            <h1 className="font-light text-5xl">RD${totalMonthIncome}</h1>
                            <div className="flex flex-col self-stretch justify-between border-t-2 py-3">
                                {monthIncomeRows}
                            </div>
                            <MoreDots section="/income" />
                        </div>
                        <div className="infoContainer2 flex-1">
                            <p>{currentDate.getFullYear()} Summary</p>
                            <div className="w-full flex-1 flex items-center py-7">
                                {incomeIsLoading || expenseCategoryIsLoading ? (
                                    <Loader />
                                ) : (
                                    <LineChart
                                        margin={{ left: 50, right: 11, top: 25 }}
                                        xAxis={[
                                            {
                                                dataKey: "name",
                                                scaleType: "point",
                                            },
                                        ]}
                                        yAxis={[
                                            {
                                                min: 0,
                                                max: lineChartMaxValue,
                                            },
                                        ]}
                                        series={[
                                            {
                                                dataKey: "inc",
                                                label: "Income",
                                                color: "#78d2b5",
                                                curve: "linear",
                                                stackOrder: "appearance",
                                            },
                                            {
                                                dataKey: "exp",
                                                label: "Expenses",
                                                color: "#d96533",
                                                curve: "linear",
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
                                            "& .MuiChartsAxisHighlight-root": {
                                                stroke: "white",
                                                strokeDasharray: 0,
                                                strokeOpacity: 0.6,
                                            },
                                        }}
                                    />
                                )}
                            </div>
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className={` w-2 h-2 rounded-full border-2 border-[#78d2b5]`}
                                    ></div>
                                    <p>Income</p>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className={` w-2 h-2 rounded-full border-2 border-[#d96533]`}
                                    ></div>
                                    <p>Expenses</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-9">
                        <div className="infoContainer2 flex-1">
                            <p>{currentMonth} Expenses</p>
                            <div className="w-full flex-1 flex items-center justify-center gap-x-9 overflow-y-hidden">
                                <div className="w-64 h-full relative">
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
                                                data: dataPieChart,
                                                id: "A",
                                                innerRadius: "65%",
                                                paddingAngle: 2,
                                                cornerRadius: 3,
                                                highlightScope: { fade: "global", highlight: "item" },
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
                                            trigger: "item",
                                            classes: {
                                                labelCell: "hidden",
                                                valueCell: "ml-3 p-3",
                                                markCell: "pl-3 pr-0",
                                            },
                                        }}
                                    ></PieChart>
                                    <h2 className="font-light text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        {`RD$${dataPieChart.reduce(
                                            (acc, currentValue) => (acc = acc + currentValue.value),
                                            0
                                        )}`}
                                    </h2>
                                </div>
                                <DiamondList
                                    items={dataPieChart.map((x) => x.label)}
                                    highlightedItem={highlightedValue}
                                />
                            </div>
                            <div className="flex flex-col self-stretch justify-between border-t-2 py-3">
                                {monthExpenseRows}
                            </div>
                            <MoreDots section="/expenses" />
                        </div>
                        <div className="infoContainer1 h-2/5">
                            <p>Saving Goals</p>
                            <div className="w-full flex-1 flex items-center justify-evenly gap-x-9">
                                {goalsProgressGauges}
                            </div>
                            <MoreDots section="/savings" />
                        </div>
                    </div>
                </div>
            </SectionContent>
        </div>
    );
}
