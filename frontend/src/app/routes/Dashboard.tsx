import SectionContent from "@//components/Layout/SectionContent";
import CustomGauge from "@//components/Graphs/CustomGauge";
import { Invoice02Icon, MoneyReceiveSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { monthList } from "@//Constants/Constants";
import CustomPieChart, { pieChartSlice } from "@//components/Graphs/CustomPieChart";
import { SummaryLineChart } from "@/features/Dashboard/Components";
import { dataSummaryLineChart } from "@/features/Dashboard/types";
import { expenseDto } from "@/features/Expenses/types";
import { useGetUserExpenseCategoriesQuery, useGetUserExpensesQuery } from "@/features/Expenses/api";
import { useGetUserIncomesQuery } from "@/features/Income/api";
import { incomeDto } from "@/features/Income/types";
import { useGetUserSavingGoalsQuery } from "@/features/Savings/api";
import { goalContributionDto } from "@/features/Savings/types";
import DataSection from "@/components/Layout/DataSection";

export default function Dashboard() {
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    let dataLineChart: dataSummaryLineChart = [],
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
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetUserSavingGoalsQuery();

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
                    label: expenseCategoryData.find((c) => c.id === parseInt(key))?.category ?? "Others",
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
                    <DataSection
                        title={`${currentMonth} Income`}
                        isLoading={incomeIsLoading}
                        link="/income"
                    >
                        <h1 className="font-light text-4xl 2xl:text-5xl my-auto">
                            RD${totalMonthIncome}
                        </h1>
                        <div className="2xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                            {monthIncomeRows}
                        </div>
                    </DataSection>
                </div>

                <div className="infoContainer1 flex-1 hidden col-span-3 md:flex xl:col-span-4 xl:row-span-7 xl:order-3 2xl:row-span-6 2xl:col-span-5">
                    <DataSection
                        title={`${currentMonth} Expenses`}
                        isLoading={expenseCategoryIsLoading}
                        link="/expenses"
                    >
                        <div className="w-full md:h-52 xl:flex-1 overflow-y-hidden">
                            <CustomPieChart data={dataPieChart} total={totalMonthExpenses} />
                        </div>

                        <div className="xl:flex flex-col self-stretch justify-between border-t-2 py-3 hidden">
                            {monthExpenseRows}
                        </div>
                    </DataSection>
                </div>

                <div className="infoContainer2 md:col-span-5 xl:col-span-7 xl:row-span-6 xl:order-2 2xl:row-span-6 2xl:col-span-6">
                    <DataSection
                        title={`${currentDate.getFullYear()} Summary`}
                        isLoading={incomeIsLoading || expenseCategoryIsLoading}
                        isEmpty={!dataLineChart.some((x) => x.exp > 0 || x.inc > 0)}
                        customEmptyMsg="No data available for this year."
                    >
                        <div className="w-full h-52 xl:flex-1">
                            <SummaryLineChart dataLineChart={dataLineChart} />
                        </div>
                    </DataSection>
                </div>

                <div className="infoContainer1 md:col-span-5 xl:col-span-7 xl:order-4 xl:row-span-5 2xl:row-span-5 2xl:col-span-6">
                    <DataSection
                        title="Saving Goals"
                        isLoading={savingGoalIsLoading}
                        isEmpty={goalsProgressGauges.length === 0}
                        link="/savings"
                    >
                        <div className="w-full flex-1 flex items-center justify-evenly flex-wrap">
                            goalsProgressGauges
                        </div>
                    </DataSection>
                </div>
            </div>
        </SectionContent>
    );
}
