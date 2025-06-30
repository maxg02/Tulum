import { useState } from "react";
import SectionContent from "../components/Layout/SectionContent";
import { PieChart } from "@mui/x-charts/PieChart";
import { basicColors, gradientColors } from "../Constants/Colors";
import DiamondList from "../components/Misc/DiamondList";
import Table, { dataObject, tableRow } from "../components/Misc/Table";
import {
    expenseDto,
    createExpenseDto,
    expenseCategoryDto,
    updateExpenseDto,
    useGetUserExpensesQuery,
    useCreateExpenseMutation,
    useDeleteExpenseMutation,
    useGetUserExpenseCategoriesQuery,
    useUpdateExpenseMutation,
    updateBudgetPlanDto,
    createBudgetPlanDto,
    useCreateBudgetPlanMutation,
    useDeleteBudgetPlanMutation,
    useUpdateBudgetPlanMutation,
    useUpdateExpenseCategoryMutation,
    useDeleteExpenseCategoryMutation,
    useCreateExpenseCategoryMutation,
    createExpenseCategoryDto,
    updateExpenseCategoryDto,
} from "../../api/apiSlice";
import Loader from "../components/Misc/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import CreateModal from "../components/Modals/CreateModal";
import {
    AmountField,
    DateField,
    DetailsField,
    ListField,
    SelectField,
} from "../components/Modals/ModalsFields";
import DetailsModal from "../components/Modals/DetailsModal";
import { periodicityValues } from "../Constants/Constants";
import { pieChartSlice } from "./Dashboard";
import ValuePill from "../components/Misc/ValuePill";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import ProgressBar from "../components/Graphs/ProgressBar";

export default function Expenses() {
    const [highlightedValue, setHighlightedValue] = useState(null);
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number>(0);

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    let expensesRow: tableRow[] = [];

    let budgetExpensesRow: tableRow[] = [],
        expenseCategoriesRow: tableRow[] = [],
        monthExpensesData: pieChartSlice[] = [],
        categorySelectValues:
            | {
                  id: number;
                  value: string;
              }[]
            | undefined,
        expenseCategoriesWithBudget: expenseCategoryDto[] = [];

    let totalMonthExpenses: number = 0;
    let totalYearExpenses: number = 0;

    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date()), setPeriodicity(0), setSelectValue(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    //Expense Category Fetching
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetUserExpenseCategoriesQuery();
    const [createExpenseCategory] = useCreateExpenseCategoryMutation();
    const [deleteExpenseCategory] = useDeleteExpenseCategoryMutation();
    const [updateExpenseCategory] = useUpdateExpenseCategoryMutation();

    //Expense Fetching
    const { data: expenseData, isLoading: expenseIsLoading } = useGetUserExpensesQuery();
    const [createExpense] = useCreateExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    //Budget Plan Expense Fetching
    const [createBudgetPlan] = useCreateBudgetPlanMutation();
    const [deleteBudgetPlan] = useDeleteBudgetPlanMutation();
    const [updateBudgetPlan] = useUpdateBudgetPlanMutation();

    // Expenses Category Data handling
    if (
        !expenseCategoryIsLoading &&
        expenseCategoryData != undefined &&
        !expenseIsLoading &&
        expenseData != undefined
    ) {
        expenseCategoriesRow = expenseCategoryData.map((expenseCategory: expenseCategoryDto) => ({
            id: expenseCategory.id,
            data: [expenseCategory.category],
        }));

        categorySelectValues = expenseCategoryData.map((ec: expenseCategoryDto) => ({
            id: ec.id,
            value: ec.category,
        }));

        expenseCategoriesWithBudget = expenseCategoryData.filter((ec) => ec.budgetPlan);

        expensesRow = expenseData.map((expense: expenseDto) => ({
            id: expense.id,
            data: [
                expense.amount,
                expense.details,
                new Date(expense.date).toLocaleDateString("en-US"),
                expense.expenseCategoryId != null
                    ? expenseCategoryData.find((ec) => ec.id === expense.expenseCategoryId)!.category
                    : "otros",
            ],
        }));

        // TODO: REFACTOR MONTH EXPENSES

        const yearExpenses = expenseData?.filter(
            (expense) => new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

        const monthExpenses = yearExpenses?.filter(
            (expense) => new Date(expense.date).getMonth() === currentDate.getMonth()
        );

        totalMonthExpenses = monthExpenses.reduce((acc, val) => acc + val.amount, 0);
        totalYearExpenses = yearExpenses.reduce((acc, val) => acc + val.amount, 0);

        const monthExpensesByCategory: object = Object.groupBy(
            monthExpenses,
            (expense: expenseDto) => expense.expenseCategoryId
        );

        monthExpensesData = Object.keys(monthExpensesByCategory).map<pieChartSlice>((key) => ({
            label:
                key != "null"
                    ? categorySelectValues?.find((c) => c.id === parseInt(key))!.value
                    : "Otros",
            value: monthExpensesByCategory[key].reduce((acc, expense) => acc + expense.amount, 0),
        }));

        budgetExpensesRow = expenseCategoriesWithBudget.map((ec) => ({
            id: ec.budgetPlan!.id,
            data: [
                ec.category,
                {
                    value: expenseData
                        .filter((e) => e.expenseCategoryId === ec.id)
                        .reduce((acc, value) => (acc += value.amount), 0),
                    total: ec.budgetPlan!.amount,
                },
            ],
        }));
    }

    // Show create Expense Modal
    const showCreateExpenseModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.expense = true;

        dispatch(showCreateModal(newState));
    };

    // Show create Expense Category Modal
    const showCreateExpenseCategoryModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.expenseCategory = true;

        dispatch(showCreateModal(newState));
    };

    // Show create budget planning Modal
    const showCreateBudgetModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.budgetPlanning = true;

        dispatch(showCreateModal(newState));
    };

    //Show details Expense Modal
    const showDetailsExpenseModal = (expenseId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = expenseId;
        newState.show = { ...detailsModalState.show, expense: true };

        const selectedExpenseData = expenseData!.find((exp) => exp.id === expenseId);

        setAmount(selectedExpenseData!.amount);
        setDetails(selectedExpenseData!.details);
        setDate(selectedExpenseData!.date);
        setSelectValue(selectedExpenseData!.expenseCategoryId);
        dispatch(showDetailsModal(newState));
    };

    // Show details Budget Plan Modal
    const showDetailsBudgetPlanningModal = (budgetId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = budgetId;
        newState.show = { ...detailsModalState.show, budgetPlanning: true };
        //TODO: add budgetplandto

        const selectedBudgetPlan = expenseCategoriesWithBudget.find(
            (ec) => ec.budgetPlan!.id == budgetId
        )!.budgetPlan;

        setAmount(selectedBudgetPlan!.amount);
        setSelectValue(selectedBudgetPlan!.expenseCategoryId);
        setPeriodicity(selectedBudgetPlan!.periodicity);

        dispatch(showDetailsModal(newState));
    };

    // Show details Expense Category Modal
    const showDetailsExpenseCategoryModal = (expenseCategoryId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = expenseCategoryId;
        newState.show = { ...detailsModalState.show, expenseCategory: true };

        const selectedExpenseCategoryData: expenseCategoryDto = expenseCategoryData!.filter(
            (ec: expenseCategoryDto) => ec.id === expenseCategoryId
        )[0];

        setDetails(selectedExpenseCategoryData.category);

        dispatch(showDetailsModal(newState));
    };

    // Create expense function
    const createExpenseHandler = () => {
        const expenseData: createExpenseDto = {
            amount: amount,
            details: details,
            date: date,
            expenseCategoryId: selectValue,
        };
        createExpense(expenseData);
    };

    // Create budget plan function
    const createBudgetHandler = () => {
        const budgetPlanData: createBudgetPlanDto = {
            amount: amount,
            expenseCategoryId: selectValue,
            periodicity: periodicity,
        };

        createBudgetPlan(budgetPlanData);
    };

    // Create expense category function
    const createExpenseCategoryHandler = () => {
        const expenseCategoryData: createExpenseCategoryDto = {
            category: details,
        };

        createExpenseCategory(expenseCategoryData);
    };

    // Delete Expense Function
    const deleteExpenseHandler = () => {
        const expenseId = detailsModalState.id;
        deleteExpense(expenseId!);
    };

    // Delete Budget Plan Function
    const deleteBudgetPlanHandler = () => {
        const budgetPlanId = detailsModalState.id;
        deleteBudgetPlan(budgetPlanId!);
    };

    // Delete Expense Category Function
    const deleteExpenseCategoryHandler = () => {
        const expenseCategoryId = detailsModalState.id;
        deleteExpenseCategory(expenseCategoryId!);
    };

    // Update Expense Function
    const updateExpenseHandler = () => {
        const expenseData: updateExpenseDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, date: date, expenseCategoryId: selectValue },
        };

        updateExpense(expenseData);
    };

    // Update Budget Plan Function
    const updateBudgetPlanHandler = () => {
        const budgetPlanData: updateBudgetPlanDto = {
            id: detailsModalState.id!,
            data: { amount: amount, periodicity: periodicity },
        };

        updateBudgetPlan(budgetPlanData);
    };

    // Update Expense Category Function
    const updateExpenseCategoryHandler = () => {
        const expenseCategoryData: updateExpenseCategoryDto = {
            id: detailsModalState.id!,
            data: { category: details },
        };

        updateExpenseCategory(expenseCategoryData);
    };

    const dataPieChart: pieChartSlice[] = monthExpensesData;

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
            { name: "Expenses", type: "progress" },
        ],
        rows: budgetExpensesRow,
    };

    const expenseCategoryTableData: dataObject = {
        columns: [{ name: "Category", type: "string" }],
        rows: expenseCategoriesRow,
    };

    // TODO Change expenses visualization for mobile

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-8 overflow-x-hidden overflow-y-auto 2xl:max-h-[1000px] xl:grid-cols-7 2xl:flex-1 2xl:grid-rows-12">
                    <div className="flex col-span-2 gap-3 md:hidden">
                        <div className="flex-1">
                            <ValuePill title={currentMonth} value={totalMonthExpenses} />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearExpenses} />
                        </div>
                    </div>
                    <hr className="col-span-2 border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 max-md:hidden xl:col-span-3 2xl:row-span-5">
                        <p>{`${currentMonth} Expenses`}</p>
                        <div className="w-full flex-1 flex items-center justify-center gap-x-8 xl:justify-evenly xl:gap-x-0 overflow-y-hidden">
                            <div className="w-full xl:w-[45%] 2xl:w-auto 2xl:h-full aspect-square relative">
                                {expenseCategoryIsLoading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        {/* //TODO Limit number of data */}
                                        <PieChart
                                            colors={gradientColors}
                                            margin={{ left: 0, right: 0 }}
                                            series={[
                                                {
                                                    data:
                                                        dataPieChart.length > 0
                                                            ? dataPieChart.slice(0, 5)
                                                            : [{ label: "No Data", value: 1 }],
                                                    id: "A",
                                                    innerRadius: "65%",
                                                    paddingAngle: 2,
                                                    cornerRadius: 3,
                                                    highlightScope: {
                                                        fade: "global",
                                                        highlight:
                                                            dataPieChart.length > 0 ? "item" : "none",
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
                                    items={dataPieChart.slice(0, 5).map((x) => x.label)}
                                    highlightedItem={highlightedValue}
                                />
                            )}
                        </div>
                    </div>
                    <div className="infoContainer1 col-span-2 md:order-3 xl:col-span-4 2xl:row-span-7">
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
                        <div className="flex flex-1 w-full max-h-[40rem] lg:max-h-96 2xl:max-h-none overflow-hidden">
                            {expenseCategoryIsLoading ? (
                                <Loader />
                            ) : (
                                <Table
                                    data={expensesData}
                                    detailsFunction={(expenseId: number) =>
                                        showDetailsExpenseModal(expenseId)
                                    }
                                    tablePrefix="E"
                                    rowLimit={6}
                                />
                            )}
                        </div>
                    </div>
                    <div className="infoContainer2 col-span-2 md:order-4 xl:order-2 xl:col-span-4 2xl:row-span-5">
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
                        <div className=" max-md:hidden flex flex-1 w-full max-h-[40rem] xl:max-h-52 2xl:max-h-none overflow-hidden">
                            {expenseCategoryIsLoading ? (
                                <Loader />
                            ) : (
                                <Table
                                    dark
                                    detailsFunction={(budgetId: number) =>
                                        showDetailsBudgetPlanningModal(budgetId)
                                    }
                                    data={budgetExpensesData}
                                    filters={false}
                                />
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-y-2 md:hidden max-md:max-h-96 max-md:overflow-y-auto">
                            {expenseCategoriesWithBudget.map((ec) => (
                                <div className="flex flex-col w-full">
                                    <p>
                                        {ec.category} -{" "}
                                        <span className="opacity-60">
                                            {periodicityValues[ec.budgetPlan!.periodicity]}
                                        </span>
                                    </p>
                                    <div className="w-full">
                                        <ProgressBar
                                            dark
                                            value={expenseData
                                                .filter((e) => e.expenseCategoryId === ec.id)
                                                .reduce((acc, value) => (acc += value.amount), 0)}
                                            total={ec.budgetPlan!.amount}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-1 md:order-2 xl:col-span-3 xl:order-4 2xl:row-span-7">
                        <div className="flex justify-center relative w-full">
                            <p className="text-nowrap">Expense Categories</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                                onClick={showCreateExpenseCategoryModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex flex-1 w-full max-h-96 md:max-h-52 lg:max-h-96 2xl:max-h-none overflow-hidden">
                            {expenseCategoryIsLoading ? (
                                <Loader />
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
            <CreateModal show={createModalState.expense} createFunction={createExpenseHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <SelectField
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues}
                />
                <DetailsField fieldStateHandler={setDetails} />
                <DateField fieldStateHandler={setDate} />
            </CreateModal>
            {/* Expense Details Modal */}
            <DetailsModal
                updateFunction={updateExpenseHandler}
                deleteFunction={deleteExpenseHandler}
                show={detailsModalState.show.expense}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <DateField defaultValue={date} fieldStateHandler={setDate} />
                <SelectField
                    defaultValue={selectValue}
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues!}
                />
            </DetailsModal>
            {/* Create Budget Modal */}
            <CreateModal show={createModalState.budgetPlanning} createFunction={createBudgetHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <SelectField
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues?.filter(
                        (cs) => !expenseCategoriesWithBudget.map((ec) => ec.id).includes(cs.id)
                    )}
                />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={periodicityValues}
                />
            </CreateModal>
            {/* Create Expense Category Modal */}
            <CreateModal
                show={createModalState.expenseCategory}
                createFunction={createExpenseCategoryHandler}
            >
                <DetailsField fieldStateHandler={setDetails} />
            </CreateModal>
            {/* Details Budget Planning Modal */}
            <DetailsModal
                updateFunction={updateBudgetPlanHandler}
                deleteFunction={deleteBudgetPlanHandler}
                show={detailsModalState.show.budgetPlanning}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <SelectField
                    defaultValue={selectValue}
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues!}
                    disabled
                />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={periodicityValues}
                    defaultValue={periodicity}
                />
            </DetailsModal>
            {/* Details Expense Category Modal */}
            <DetailsModal
                updateFunction={updateExpenseCategoryHandler}
                deleteFunction={deleteExpenseCategoryHandler}
                show={detailsModalState.show.expenseCategory}
            >
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
            </DetailsModal>
        </>
    );
}
