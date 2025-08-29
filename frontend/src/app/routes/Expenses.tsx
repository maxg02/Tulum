import SectionContent from "@/components/Layout/SectionContent";
import Table, { dataObject, tableRow } from "@/components/Misc/Table";
import { useGetUserExpensesQuery, useGetUserExpenseCategoriesQuery } from "@/features/Expenses/api";
import { expenseDto, expenseCategoryDto } from "@/features/Expenses/types";
import Loader from "@/components/Misc/Loader";
import { periodicityValues } from "@/Constants/Constants";
import CustomPieChart, { pieChartSlice } from "@/components/Graphs/CustomPieChart";
import ValuePill from "@/components/Misc/ValuePill";
import ProgressBar from "@/components/Graphs/ProgressBar";
import {
    ExpenseCard,
    CreateExpense,
    CreateBudget,
    CreateCategory,
    DetailsExpense,
    DetailsBudget,
    DetailsCategory,
} from "@/features/Expenses/Components";
import { useMemo } from "react";
import useModal from "@/Hooks/useModal";
import DataSection from "@/components/Layout/DataSection";

export default function Expenses() {
    const { openCreationModal, openDetailsModal } = useModal();

    const currentMonth: number = new Date().getMonth();
    const currentYear: number = new Date().getFullYear();

    //Expense Category Fetching
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetUserExpenseCategoriesQuery();

    const categorySelectValues:
        | {
              id: number;
              value: string;
          }[]
        | undefined = useMemo(
        () => [
            { id: -1, value: "Others" },
            ...(expenseCategoryData?.map((ec: expenseCategoryDto) => ({
                id: ec.id,
                value: ec.category,
            })) ?? []),
        ],
        [expenseCategoryData]
    );

    const expenseCategoriesRow: tableRow[] = useMemo(
        () =>
            expenseCategoryData
                ? expenseCategoryData.map((expenseCategory: expenseCategoryDto) => ({
                      id: expenseCategory.id,
                      data: [expenseCategory.category],
                  }))
                : [],
        [expenseCategoryData]
    );

    const expenseCategoriesWithBudget = useMemo(
        () => expenseCategoryData?.filter((ec) => ec.budgetPlan) ?? [],
        [expenseCategoryData]
    );

    //Expense Fetching
    const {
        data: expenseData,
        isFetching: expenseIsFetching,
        isLoading: expenseIsLoading,
    } = useGetUserExpensesQuery();

    const expensesRow: tableRow[] = useMemo(
        () =>
            expenseData && expenseCategoryData
                ? expenseData.map((expense: expenseDto) => ({
                      id: expense.id,
                      data: [
                          expense.amount,
                          expense.details,
                          new Date(expense.date).toLocaleDateString("en-US"),
                          expense.expenseCategoryId != -1
                              ? expenseCategoryData.find((ec) => ec.id === expense.expenseCategoryId)
                                    ?.category ?? "Others"
                              : "Others",
                      ],
                  }))
                : [],
        [expenseData, expenseCategoryData]
    );

    const yearExpenses = useMemo(
        () =>
            expenseData?.filter((expense) => new Date(expense.date).getFullYear() === currentYear) ?? [],
        [expenseData, currentYear]
    );
    const monthExpenses = useMemo(
        () => yearExpenses?.filter((expense) => new Date(expense.date).getMonth() === currentMonth) ?? [],
        [yearExpenses, currentMonth]
    );

    const monthExpensesByCategory = useMemo(
        () =>
            Object.groupBy(
                monthExpenses.filter((ex) => ex.expenseCategoryId),
                ({ expenseCategoryId }) => expenseCategoryId!.toString()
            ),
        [monthExpenses]
    );

    const dataPieChart = useMemo(
        () =>
            expenseCategoryData
                ? Object.keys(monthExpensesByCategory).map<pieChartSlice>((key) => ({
                      label:
                          expenseCategoryData!.find((c) => c.id === parseInt(key))?.category ?? "Others",
                      value: monthExpensesByCategory[key as keyof typeof monthExpensesByCategory]!.reduce(
                          (acc, expense) => acc + expense.amount,
                          0
                      ),
                  }))
                : [],
        [monthExpensesByCategory, expenseCategoryData]
    );

    const totalMonthExpenses = useMemo(
        () => monthExpenses.reduce((acc, val) => acc + val.amount, 0),
        [monthExpenses]
    );
    const totalYearExpenses = useMemo(
        () => yearExpenses.reduce((acc, val) => acc + val.amount, 0),
        [yearExpenses]
    );

    const budgetExpensesRow = useMemo(
        () =>
            expenseCategoriesWithBudget.map((ec) => {
                const budgetExpenses = ec.budgetPlan!.periodicity === 0 ? monthExpenses : yearExpenses;

                return {
                    id: ec.budgetPlan!.id,
                    data: [
                        ec.category,
                        periodicityValues[ec.budgetPlan!.periodicity],
                        {
                            value: budgetExpenses
                                .filter((e) => e.expenseCategoryId === ec.id)
                                .reduce((acc, value) => (acc += value.amount), 0),
                            total: ec.budgetPlan!.amount,
                        },
                    ],
                };
            }),
        [expenseCategoriesWithBudget, monthExpenses, yearExpenses]
    );

    const expensesData: dataObject = {
        columns: [
            { name: "Amount", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
            { name: "Category", type: "string" },
        ],
        rows: expensesRow,
    };

    const budgetExpensesData: dataObject = {
        columns: [
            { name: "Budget", type: "string" },
            { name: "Periodicity", type: "string" },
            { name: "Expenses", type: "progress" },
        ],
        rows: budgetExpensesRow,
    };

    const expenseCategoryTableData: dataObject = {
        columns: [{ name: "Category", type: "string" }],
        rows: expenseCategoriesRow,
    };

    const ExpenseCards = () =>
        expenseData?.map((e) => (
            <ExpenseCard
                key={e.id}
                expense={e}
                expenseCategoryData={expenseCategoryData}
                showDetailsExpenseModal={(expenseId: number) => {
                    const expense = expenseData?.find((e) => e.id === expenseId) ?? null;
                    openDetailsModal("expense", expense);
                }}
            />
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-8 overflow-x-hidden overflow-y-auto md:grid-cols-5 xl:grid-cols-7 xl:max-2xl:gap-5 xl:flex-1 xl:grid-rows-12 2xl:max-h-[1000px]">
                    <div className="flex col-span-2 gap-3 md:hidden">
                        <div className="flex-1">
                            <ValuePill
                                title={new Date(0, currentMonth).toLocaleString("en-US", {
                                    month: "long",
                                })}
                                value={totalMonthExpenses}
                            />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearExpenses} />
                        </div>
                    </div>
                    <hr className="col-span-2 border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 max-md:hidden md:col-span-3 xl:col-span-3 xl:row-span-6 2xl:row-span-5">
                        <p>{`${new Date(0, currentMonth).toLocaleString("en-US", {
                            month: "long",
                        })} Expenses`}</p>
                        <div className="w-full md:h-52 2xl:flex-1 overflow-y-hidden">
                            {expenseCategoryIsLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    <CustomPieChart data={dataPieChart} total={totalMonthExpenses} />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="infoContainer1 col-span-2 md:col-span-5 md:order-3 xl:col-span-4 xl:row-span-6 2xl:row-span-7">
                        <DataSection
                            isLoading={expenseCategoryIsLoading || expenseIsLoading}
                            createFunction={() => openCreationModal("expense")}
                            isEmpty={expenseData?.length === 0}
                            title="Expenses"
                        >
                            <div className="flex flex-1 w-full max-h-[40rem] max-md:hidden xl:max-h-none overflow-hidden">
                                <Table
                                    data={expensesData}
                                    detailsFunction={(expenseId: number) => {
                                        const expense =
                                            expenseData?.find((e) => e.id === expenseId) ?? null;
                                        openDetailsModal("expense", expense);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col w-full overflow-x-hidden gap-4 max-h-[40rem] overflow-y-auto md:hidden">
                                {expenseIsFetching ? <Loader /> : <ExpenseCards />}
                            </div>
                        </DataSection>
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-5 md:order-4 xl:order-2 xl:col-span-4 xl:row-span-6 2xl:row-span-5">
                        <DataSection
                            title="Budgets"
                            createFunction={() => openCreationModal("budgetPlanning")}
                            isLoading={expenseCategoryIsLoading || expenseIsLoading}
                            isEmpty={budgetExpensesData.rows.length === 0}
                        >
                            {!(expenseCategoryIsLoading || expenseIsLoading) && (
                                <>
                                    <div className=" max-md:hidden flex flex-1 w-full max-h-[40rem] xl:max-h-none overflow-hidden">
                                        <Table
                                            dark
                                            detailsFunction={(budgetId: number) => {
                                                const budgetPlan =
                                                    expenseCategoriesWithBudget.find(
                                                        (ec) => ec.budgetPlan?.id == budgetId
                                                    )?.budgetPlan ?? null;
                                                openDetailsModal("budgetPlanning", budgetPlan);
                                            }}
                                            data={budgetExpensesData}
                                        />
                                    </div>
                                    <div className="w-full flex flex-col gap-y-2 md:hidden max-md:max-h-96 max-md:overflow-y-auto">
                                        {expenseCategoriesWithBudget.map((ec, key) => {
                                            return (
                                                <div className="flex flex-col w-full" key={key}>
                                                    <p>
                                                        {ec.category} -{" "}
                                                        <span className="opacity-60">
                                                            {
                                                                periodicityValues[
                                                                    ec.budgetPlan!.periodicity
                                                                ]
                                                            }
                                                        </span>
                                                    </p>
                                                    <div className="w-full">
                                                        <ProgressBar
                                                            dark
                                                            value={expenseData!
                                                                .filter(
                                                                    (e) => e.expenseCategoryId === ec.id
                                                                )
                                                                .reduce(
                                                                    (acc, value) => (acc += value.amount),
                                                                    0
                                                                )}
                                                            total={ec.budgetPlan!.amount}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </DataSection>
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-2 md:order-2 xl:col-span-3 xl:order-4 xl:row-span-6 2xl:row-span-7">
                        <DataSection
                            title="Expense Categories"
                            createFunction={() => openCreationModal("expenseCategory")}
                            isLoading={expenseCategoryIsLoading}
                            isEmpty={expenseCategoryData?.length === 0}
                        >
                            <Table
                                data={expenseCategoryTableData}
                                detailsFunction={(expenseCategoryId: number) => {
                                    const expenseCategory =
                                        expenseCategoryData?.find((ec) => ec.id === expenseCategoryId) ??
                                        null;
                                    openDetailsModal("expenseCategory", expenseCategory);
                                }}
                                dark
                            />
                        </DataSection>
                    </div>
                </div>
            </SectionContent>
            {/* Create Expense Modal */}
            <CreateExpense categories={categorySelectValues} />
            {/* Details Expense Modal */}
            <DetailsExpense categories={categorySelectValues} />
            {/* Create Budget Modal */}
            <CreateBudget
                categories={categorySelectValues?.filter(
                    (cs) => cs.id !== -1 && !expenseCategoriesWithBudget.some((ec) => ec.id === cs.id)
                )}
            />
            {/* Details Budget Planning Modal */}
            <DetailsBudget categories={categorySelectValues} />
            {/* Create Expense Category Modal */}
            <CreateCategory />
            {/* Details Expense Category Modal */}
            <DetailsCategory />
        </>
    );
}
