import SectionContent from "@/components/Layout/SectionContent";
import Table, { dataObject, tableRow } from "@/components/Misc/Table";
import { useGetUserExpensesQuery, useGetUserExpenseCategoriesQuery } from "@/features/Expenses/api";
import { expenseDto, expenseCategoryDto } from "@/features/Expenses/types";
import Loader from "@/components/Misc/Loader";
import { useAppDispatch, useAppSelector } from "@/Hooks/stateHooks";
import { showModal as showCreateModal } from "@/reducers/createModalReducers";
import { showModal as showDetailsModal } from "@/reducers/detailsModalReducers";
import { periodicityValues } from "@/Constants/Constants";
import CustomPieChart, { pieChartSlice } from "@/components/Graphs/CustomPieChart";
import ValuePill from "@/components/Misc/ValuePill";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
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

export default function Expenses() {
    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    const categorySelectValues:
        | {
              id: number;
              value: string;
          }[]
        | undefined = [{ id: -1, value: "Others" }];
    let expensesRow: tableRow[] = [];

    let budgetExpensesRow: tableRow[] = [],
        expenseCategoriesRow: tableRow[] = [],
        dataPieChart: pieChartSlice[] = [],
        expenseCategoriesWithBudget: expenseCategoryDto[] = [];

    let totalMonthExpenses: number = 0;
    let totalYearExpenses: number = 0;

    //Expense Category Fetching
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetUserExpenseCategoriesQuery();

    //Expense Fetching
    const { data: expenseData, isLoading: expenseIsLoading } = useGetUserExpensesQuery();

    // Expenses Category Data handling
    if (
        !expenseCategoryIsLoading &&
        expenseCategoryData != undefined &&
        !expenseIsLoading &&
        expenseData != undefined
    ) {
        let yearExpenses: expenseDto[] = [];

        let monthExpenses: expenseDto[] = [];

        if (expenseCategoryData.length) {
            expenseCategoriesRow = expenseCategoryData.map((expenseCategory: expenseCategoryDto) => ({
                id: expenseCategory.id,
                data: [expenseCategory.category],
            }));

            expenseCategoryData.map((ec: expenseCategoryDto) =>
                categorySelectValues.push({
                    id: ec.id,
                    value: ec.category,
                })
            );

            expenseCategoriesWithBudget = expenseCategoryData.filter((ec) => ec.budgetPlan);
        }

        if (expenseData.length) {
            expensesRow = expenseData.map((expense: expenseDto) => ({
                id: expense.id,
                data: [
                    expense.amount,
                    expense.details,
                    new Date(expense.date).toLocaleDateString("en-US"),
                    expense.expenseCategoryId != -1
                        ? expenseCategoryData.find((ec) => ec.id === expense.expenseCategoryId)!.category
                        : "Others",
                ],
            }));

            yearExpenses = expenseData?.filter(
                (expense) => new Date(expense.date).getFullYear() === currentDate.getFullYear()
            );

            monthExpenses = yearExpenses?.filter(
                (expense) => new Date(expense.date).getMonth() === currentDate.getMonth()
            );

            totalMonthExpenses = monthExpenses.reduce((acc, val) => acc + val.amount, 0);
            totalYearExpenses = yearExpenses.reduce((acc, val) => acc + val.amount, 0);

            if (monthExpenses.length > 0) {
                const monthExpensesByCategory = Object.groupBy(
                    monthExpenses.filter((ex) => ex.expenseCategoryId),
                    ({ expenseCategoryId }) => expenseCategoryId!.toString()
                );

                dataPieChart = Object.keys(monthExpensesByCategory)
                    .map<pieChartSlice>((key) => ({
                        label: categorySelectValues?.find((c) => c.id === parseInt(key))!.value,
                        value: monthExpensesByCategory[
                            key as keyof typeof monthExpensesByCategory
                        ]!.reduce((acc, expense) => acc + expense.amount, 0),
                    }))
                    .sort((a, b) => b.value - a.value);
            }
        }

        budgetExpensesRow = expenseCategoriesWithBudget.map((ec) => {
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
        });
    }

    // Show create Expense Modal
    const showCreateExpenseModal = () => {
        const newState = { ...createModalState };
        newState.expense = true;

        dispatch(showCreateModal(newState));
    };

    // Show create Expense Category Modal
    const showCreateExpenseCategoryModal = () => {
        const newState = { ...createModalState };
        newState.expenseCategory = true;

        dispatch(showCreateModal(newState));
    };

    // Show create budget planning Modal
    const showCreateBudgetModal = () => {
        const newState = { ...createModalState };
        newState.budgetPlanning = true;

        dispatch(showCreateModal(newState));
    };

    //Show details Expense Modal
    const showDetailsExpenseModal = (expenseId: number) => {
        const selectedExpenseData = expenseData!.find((exp) => exp.id === expenseId);
        const newState = { ...detailsModalState };
        newState.show = { ...detailsModalState.show, expense: true };
        newState.data = selectedExpenseData;
        dispatch(showDetailsModal(newState));
    };

    // Show details Budget Plan Modal
    const showDetailsBudgetPlanningModal = (budgetId: number) => {
        const selectedBudgetPlan = expenseCategoriesWithBudget.find(
            (ec) => ec.budgetPlan!.id == budgetId
        )!.budgetPlan;
        const newState = { ...detailsModalState };
        newState.show = { ...detailsModalState.show, budgetPlanning: true };
        newState.data = selectedBudgetPlan;
        dispatch(showDetailsModal(newState));
    };

    // Show details Expense Category Modal
    const showDetailsExpenseCategoryModal = (expenseCategoryId: number) => {
        const selectedExpenseCategoryData: expenseCategoryDto = expenseCategoryData!.find(
            (ec: expenseCategoryDto) => ec.id === expenseCategoryId
        )!;

        const newState = { ...detailsModalState };
        newState.show = { ...detailsModalState.show, expenseCategory: true };
        newState.data = selectedExpenseCategoryData;
        dispatch(showDetailsModal(newState));
    };

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
                showDetailsExpenseModal={showDetailsExpenseModal}
            />
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-8 overflow-x-hidden overflow-y-auto md:grid-cols-5 xl:grid-cols-7 xl:max-2xl:gap-5 xl:flex-1 xl:grid-rows-12 2xl:max-h-[1000px]">
                    <div className="flex col-span-2 gap-3 md:hidden">
                        <div className="flex-1">
                            <ValuePill title={currentMonth} value={totalMonthExpenses} />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearExpenses} />
                        </div>
                    </div>
                    <hr className="col-span-2 border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 max-md:hidden md:col-span-3 xl:col-span-3 xl:row-span-6 2xl:row-span-5">
                        <p>{`${currentMonth} Expenses`}</p>
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
                        <div className="flex justify-center relative w-full">
                            <p className="text-nowrap">Expenses</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateExpenseModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        {expenseCategoryIsLoading ? (
                            <Loader />
                        ) : expensesData && expenseData?.length === 0 ? (
                            <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full justify-self-center">
                                <p>Press</p>
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                                <p>to add a new expense</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-1 w-full max-h-[40rem] max-md:hidden xl:max-h-none overflow-hidden">
                                    <Table
                                        data={expensesData}
                                        detailsFunction={(expenseId: number) =>
                                            showDetailsExpenseModal(expenseId)
                                        }
                                        filters={false}
                                    />
                                </div>
                                <div className="flex flex-col w-full overflow-x-hidden gap-4 max-h-[40rem] overflow-y-auto md:hidden">
                                    <ExpenseCards />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-5 md:order-4 xl:order-2 xl:col-span-4 xl:row-span-6 2xl:row-span-5">
                        <div className="flex justify-center w-full relative">
                            <p className="text-nowrap">Budgets</p>
                            <button
                                className="absolute right-0 top-0  tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateBudgetModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>

                        {expenseCategoryIsLoading || expenseIsLoading ? (
                            <Loader />
                        ) : budgetExpensesData.rows.length ? (
                            <>
                                <div className=" max-md:hidden flex flex-1 w-full max-h-[40rem] xl:max-h-none overflow-hidden">
                                    <Table
                                        dark
                                        detailsFunction={(budgetId: number) =>
                                            showDetailsBudgetPlanningModal(budgetId)
                                        }
                                        data={budgetExpensesData}
                                        filters={false}
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-y-2 md:hidden max-md:max-h-96 max-md:overflow-y-auto">
                                    {expenseCategoriesWithBudget.map((ec, key) => (
                                        <div className="flex flex-col w-full" key={key}>
                                            <p>
                                                {ec.category} -{" "}
                                                <span className="opacity-60">
                                                    {periodicityValues[ec.budgetPlan!.periodicity]}
                                                </span>
                                            </p>
                                            <div className="w-full">
                                                <ProgressBar
                                                    dark
                                                    value={expenseData!
                                                        .filter((e) => e.expenseCategoryId === ec.id)
                                                        .reduce((acc, value) => (acc += value.amount), 0)}
                                                    total={ec.budgetPlan!.amount}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full w-full justify-center">
                                <p>Press</p>
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                                <p>to configure a new budget</p>
                            </div>
                        )}
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-2 md:order-2 xl:col-span-3 xl:order-4 xl:row-span-6 2xl:row-span-7">
                        <div className="flex justify-center relative w-full">
                            <p className="text-nowrap">Expense Categories</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateExpenseCategoryModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex flex-1 w-full max-h-96 md:max-h-52 xl:max-h-none overflow-hidden">
                            {expenseCategoryIsLoading ? (
                                <Loader />
                            ) : expenseCategoryData && expenseCategoryData?.length === 0 ? (
                                <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full w-full justify-center">
                                    <p>Press</p>
                                    <HugeiconsIcon
                                        icon={AddSquareIcon}
                                        size={20}
                                        className="text-custom-accent"
                                    />
                                    <p>to add a new category</p>
                                </div>
                            ) : (
                                <Table
                                    data={expenseCategoryTableData}
                                    detailsFunction={(expenseCategoryId: number) =>
                                        showDetailsExpenseCategoryModal(expenseCategoryId)
                                    }
                                    dark
                                    filters={false}
                                />
                            )}
                        </div>
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
