import SectionContent from "../components/Layout/SectionContent";
import MoreDots from "../components/Misc/MoreDots";
import { LineChart, markElementClasses } from "@mui/x-charts/LineChart";
import CustomGauge from "../components/Graphs/CustomGauge";
import {
    expenseDto,
    goalContributionDto,
    incomeDto,
    useGetUserExpenseCategoriesQuery,
    useGetUserIncomesQuery,
    useGetSavingGoalsByUserIdQuery,
    useGetUserExpensesQuery,
} from "../api/apiSlice";
import Loader from "../components/Misc/Loader";
import { Invoice02Icon, MoneyReceiveSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { axisClasses, chartsGridClasses } from "@mui/x-charts";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { monthList } from "../Constants/Constants";
import CustomPieChart, { pieChartSlice } from "../components/Graphs/CustomPieChart";

export default function Dashboard() {
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    let dataLineChart: {
            month: string;
            inc: number;
            exp: number;
        }[] = [],
        totalMonthIncome: number = 0,
        monthIncomeRows: JSX.Element[] = [],
        monthExpenseRows: JSX.Element[] = [],
        totalMonthExpenses: number = 0,
        dataPieChart: pieChartSlice[] = [],
        goalsProgressData: { label: string; progress: number; value: number }[] = [],
        yearExpenses: expenseDto[] = [],
        yearIncomes: incomeDto[] = [];

    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetUserExpenseCategoriesQuery();
    const { data: expenseData, isLoading: expenseIsLoading } = useGetUserExpensesQuery();
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetSavingGoalsByUserIdQuery(1);

    if (!incomeIsLoading && incomeData?.length) {
        yearIncomes = incomeData.filter(
            (income) => new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        const monthIncomes = incomeData.filter(
            (income) =>
                new Date(income.date).getMonth() === currentDate.getMonth() &&
                new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        if (monthIncomes.length) {
            totalMonthIncome = monthIncomes.reduce(
                (acc: number, next: incomeDto) => acc + next.amount,
                0
            );

            monthIncomeRows = monthIncomes
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
        }
    }

    if (
        !expenseCategoryIsLoading &&
        !expenseIsLoading &&
        expenseData?.length &&
        expenseCategoryData != undefined
    ) {
        const monthExpenses = expenseData?.filter(
            (expense) =>
                new Date(expense.date).getMonth() === currentDate.getMonth() &&
                new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

        yearExpenses = expenseData?.filter(
            (expense) => new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

        if (monthExpenses.length > 0) {
            totalMonthExpenses = monthExpenses.reduce((acc, val) => acc + val.amount, 0);

            monthExpenseRows = monthExpenses
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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

            const monthExpensesByCategory = Object.groupBy(
                monthExpenses.filter((ex) => ex.expenseCategoryId),
                ({ expenseCategoryId }) => expenseCategoryId!.toString()
            );

            dataPieChart = Object.keys(monthExpensesByCategory)
                .map<pieChartSlice>((key) => ({
                    label: expenseCategoryData.find((c) => c.id === parseInt(key))!.category,
                    value: monthExpensesByCategory[key as keyof typeof monthExpensesByCategory]!.reduce(
                        (acc, expense) => acc + expense.amount,
                        0
                    ),
                }))
                .sort((a, b) => b.value - a.value);
        }
    }

    if (!savingGoalIsLoading && savingGoalData?.length) {
        const allGoalContributions = savingGoalData
            ?.map((sG) => sG.goalContributions)
            .reduce((acc, currentValue) => acc!.concat(currentValue!), []);

        const goalContributionsBySavings = Object.groupBy(
            allGoalContributions,
            (gC: goalContributionDto) => gC.savingGoalId
        );

        goalsProgressData = savingGoalData
            .map((sg) => {
                const progress = goalContributionsBySavings[
                    sg.id as keyof typeof goalContributionsBySavings
                ]
                    ? goalContributionsBySavings[
                          sg.id as keyof typeof goalContributionsBySavings
                      ]!.reduce((acc: number, gC: goalContributionDto) => acc + gC.amount, 0)
                    : 0;

                return {
                    label: sg!.details,
                    id: sg!.id,
                    total: sg!.goal,
                    progress: progress,
                    value: (progress * 100) / sg!.goal,
                };
            })
            .sort((a, b) => a.value - b.value)
            .reverse();
    }

    dataLineChart = monthList.map((month) => ({
        month,
        inc: yearIncomes
            .filter(
                (income: incomeDto) =>
                    new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(income.date)) ==
                    month
            )
            .reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
        exp: yearExpenses
            .filter(
                (expense: expenseDto) =>
                    new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(expense.date)) ==
                    month
            )
            .reduce((acc: number, next: expenseDto) => acc + next.amount, 0),
    }));

    const goalsProgressGauges = goalsProgressData.slice(0, 3).map((gp, key) => (
        <div className="flex flex-col items-center basis-[28%] md:basis-1/5 2xl:basis-1/4" key={key}>
            <div className="w-full mb-2 h-auto aspect-square overflow-hidden">
                <CustomGauge value={gp.value} label={`${Math.round(gp.value)}%`} />
            </div>
            <p>{gp.label}</p>
        </div>
    ));

    return (
        <SectionContent>
            <div className="grid grid-cols-1 gap-8 overflow-x-hidden overflow-y-auto auto-rows-auto md:grid-cols-5 xl:grid-cols-11 xl:grid-rows-11 xl:flex-1 xl:max-2xl:gap-5 xl:max-h-[1000px]">
                <div className="flex flex-col gap-6 border-b-2 md:hidden">
                    <p className="self-center">{currentMonth} Balance</p>
                    <div className="flex gap-9 px-4 mb-8">
                        <div className="flex justify-center items-center bg-custom-ly1 containerShadow rounded-2xl flex-1 py-5">
                            <HugeiconsIcon className={"me-2"} icon={MoneyReceiveSquareIcon} size={30} />
                            <h1 className="font-light text-xl">RD${totalMonthIncome}</h1>
                        </div>
                        <div className="flex justify-center items-center bg-custom-ly2 rounded-2xl flex-1">
                            <HugeiconsIcon className={"me-2"} icon={Invoice02Icon} size={30} />
                            <h1 className="font-light text-xl">RD${totalMonthExpenses}</h1>
                        </div>
                    </div>
                </div>

                <div className="infoContainer1 hidden col-span-2 md:flex xl:col-span-4 xl:row-span-4 2xl:row-span-5 2xl:col-span-5">
                    <div className="flex justify-center relative w-full">
                        <p className="text-nowrap">{currentMonth} Income</p>
                        <div className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100">
                            <MoreDots section="/income" />
                        </div>
                    </div>
                    <h1 className="font-light text-4xl 2xl:text-5xl my-auto">RD${totalMonthIncome}</h1>
                    <div className="2xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                        {monthIncomeRows}
                    </div>
                </div>

                <div className="infoContainer1 flex-1 hidden col-span-3 md:flex xl:col-span-4 xl:row-span-7 xl:order-3 2xl:row-span-6 2xl:col-span-5">
                    <div className="flex justify-center relative w-full">
                        <p className="text-nowrap">{currentMonth} Expenses</p>
                        <div className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100">
                            <MoreDots section="/expenses" />
                        </div>
                    </div>
                    <div className="w-full md:h-52 xl:flex-1 overflow-y-hidden">
                        {expenseCategoryIsLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <CustomPieChart data={dataPieChart} total={totalMonthExpenses} />
                            </>
                        )}
                    </div>

                    <div className="xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                        {monthExpenseRows}
                    </div>
                </div>

                <div className="infoContainer2 md:col-span-5 xl:col-span-7 xl:row-span-6 xl:order-2 2xl:row-span-6 2xl:col-span-6">
                    <p>{currentDate.getFullYear()} Summary</p>
                    <div className="w-full h-52 xl:flex-1">
                        {incomeIsLoading || expenseCategoryIsLoading ? (
                            <Loader />
                        ) : dataLineChart.some((x) => x.exp > 0 || x.inc > 0) ? (
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
                                        valueFormatter: (value) =>
                                            value == null ? "RD$0" : `RD$${value}`,
                                        labelMarkType: "circle",
                                    },
                                    {
                                        dataKey: "exp",
                                        label: "Expenses",
                                        color: "#d96533",
                                        curve: "linear",
                                        valueFormatter: (value) =>
                                            value == null ? "RD$0" : `RD$${value}`,
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
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">No data available for this year.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="infoContainer1 md:col-span-5 xl:col-span-7 xl:order-4 xl:row-span-5 2xl:row-span-5 2xl:col-span-6">
                    <div className="flex justify-center relative w-full">
                        <p className="text-nowrap">Saving Goals</p>
                        <div className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100">
                            <MoreDots section="/savings" />
                        </div>
                    </div>
                    <div className="w-full flex-1 flex items-center justify-evenly flex-wrap">
                        {savingGoalIsLoading ? (
                            <Loader />
                        ) : goalsProgressGauges.length ? (
                            goalsProgressGauges
                        ) : (
                            <p className="text-gray-400 py-12">No saving goals available.</p>
                        )}
                    </div>
                </div>
            </div>
        </SectionContent>
    );
}
