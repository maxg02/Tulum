import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { PieChart } from "@mui/x-charts/PieChart";
import { basicColors, gradientColors } from "../components/Colors";
import DiamondList from "../components/DiamondList";
import Table, { dataObject, tableRow } from "../components/Table";
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
    fixedExpenseDto,
    // createFixedExpenseDto,
    // useGetUserFixedExpensesQuery,
    // useCreateFixedExpenseMutation,
    // useDeleteFixedExpenseMutation,
    // useUpdateFixedExpenseMutation,
    // updateFixedExpenseDto,
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
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import CreateModal from "../components/CreateModal";
import { AmountField, DateField, DetailsField, ListField, SelectField } from "../components/ModalsFields";
import DetailsModal from "../components/DetailsModal";
import { periodicityValues } from "../components/Constants";
import { pieChartSlice } from "./Dashboard";

export default function Expenses() {
    const [highlightedValue, setHighlightedValue] = useState(null);
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number>(0);

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    let expensesRow: tableRow[] = [];

    //let fixedExpensesRow: tableRow[] = [];

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

    // //Fixed Expense Fetching
    // const { data: fixedExpenseData, isLoading: fixedExpenseIsLoading } = useGetUserFixedExpensesQuery();
    // const [createFixedExpense] = useCreateFixedExpenseMutation();
    // const [deleteFixedExpense] = useDeleteFixedExpenseMutation();
    // const [updateFixedExpense] = useUpdateFixedExpenseMutation();

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

        const monthExpenses = expenseData?.filter(
            (expense) =>
                new Date(expense.date).getMonth() === currentDate.getMonth() &&
                new Date(expense.date).getFullYear() === currentDate.getFullYear()
        );

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

        // fixedExpensesRow = fixedExpenseData.map((fixedExpense: fixedExpenseDto) => ({
        //     id: fixedExpense.id,
        //     data: [
        //         fixedExpense.amount,
        //         fixedExpense.details,
        //         fixedExpense.periodicity,
        //         expenseCategoryData.find((ec) => ec.id === fixedExpense.category)!.category,
        //     ],
        // }));

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

    // // Show create Fixed Expense Modal
    // const showCreateFixedExpenseModal = () => {
    //     clearFieldValues();
    //     const newState = { ...createModalState };
    //     newState.fixedExpense = true;

    //     dispatch(showCreateModal(newState));
    // };

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

    // //Show details Fixed Expense Modal
    // const showDetailsFixedExpenseModal = (fixedExpenseId: number) => {
    //     clearFieldValues();
    //     const newState = { ...detailsModalState };
    //     newState.id = fixedExpenseId;
    //     newState.show = { ...detailsModalState.show, fixedExpense: true };

    //     const selectedFixedExpenseData = fixedExpenseData!.find((fExp) => fExp.id === fixedExpenseId);

    //     setAmount(selectedFixedExpenseData!.amount);
    //     setDetails(selectedFixedExpenseData!.details);
    //     setPeriodicity(selectedFixedExpenseData!.periodicity);
    //     setSelectValue(selectedFixedExpenseData!.category);
    //     dispatch(showDetailsModal(newState));
    // };

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

    // // Create fixed expense function
    // const createFixedExpenseHandler = () => {
    //     const fixedExpenseData: createFixedExpenseDto = {
    //         amount: amount,
    //         details: details,
    //         periodicity: periodicity,
    //         category: selectValue,
    //     };
    //     createFixedExpense(fixedExpenseData);
    // };

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

    // // Delete Fixed Expense Function
    // const deleteFixedExpenseHandler = () => {
    //     const fixedExpenseId = detailsModalState.id;
    //     deleteFixedExpense(fixedExpenseId!);
    // };

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

    // // Update Fixed Expense Function
    // const updateFixedExpenseHandler = () => {
    //     const fixedExpenseData: updateFixedExpenseDto = {
    //         id: detailsModalState.id!,
    //         data: {
    //             amount: amount,
    //             details: details,
    //             periodicity: periodicity,
    //             category: selectValue,
    //         },
    //     };

    //     updateFixedExpense(fixedExpenseData);
    // };

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

    // const fixedExpensesData: dataObject = {
    //     columns: [
    //         { name: "Expense", type: "amount" },
    //         { name: "Details", type: "string" },
    //         {
    //             name: "Periodicity",
    //             type: "list",
    //             values: periodicityValues,
    //         },
    //         { name: "Category", type: "string" },
    //     ],
    //     rows: fixedExpensesRow,
    // };

    const expenseCategoryTableData: dataObject = {
        columns: [{ name: "Category", type: "string" }],
        rows: expenseCategoriesRow,
    };

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Expenses" />
            <SectionContent>
                <Header currentSection="Expenses" />
                <div className="flex-1 flex flex-col overflow-hidden gap-y-9">
                    <div className="flex flex-1 gap-x-9">
                        <div className="infoContainer1 w-2/5">
                            <p>{`${currentMonth} Expenses`}</p>
                            <div
                                className={`w-full flex-1 flex items-center justify-center ${
                                    dataPieChart.length && "gap-x-9"
                                }`}
                            >
                                <div className="w-80 h-full relative">
                                    {expenseCategoryIsLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            {dataPieChart.length ? (
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
                                                            highlightScope: {
                                                                fade: "global",
                                                                highlight: "item",
                                                            },
                                                            faded: {
                                                                color: "gray",
                                                                additionalRadius: -5,
                                                            },
                                                            valueFormatter: (value) =>
                                                                `RD$${value.value}`,
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
                                            ) : (
                                                <PieChart
                                                    colors={[basicColors.ly2]}
                                                    margin={{ left: 0, right: 0 }}
                                                    series={[
                                                        {
                                                            data: [
                                                                {
                                                                    label: "empty",
                                                                    value: 100,
                                                                },
                                                            ],
                                                            id: "B",
                                                            innerRadius: "65%",
                                                            paddingAngle: 2,
                                                            cornerRadius: 3,
                                                        },
                                                    ]}
                                                    slotProps={{ legend: { hidden: true } }}
                                                    sx={{
                                                        "& .MuiPieArc-root": { strokeWidth: 0 },
                                                    }}
                                                    tooltip={{
                                                        trigger: "none",
                                                    }}
                                                ></PieChart>
                                            )}

                                            <h2 className="font-light text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                {`RD$${dataPieChart.reduce(
                                                    (acc, currentValue) =>
                                                        (acc = acc + currentValue.value),
                                                    0
                                                )}`}
                                            </h2>
                                        </>
                                    )}
                                </div>
                                <DiamondList
                                    items={dataPieChart.map((x) => x.label)}
                                    highlightedItem={highlightedValue}
                                />
                            </div>
                        </div>
                        <div className="infoContainer1 flex-1">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Expenses</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateExpenseModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-center flex-1 w-full">
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
                    </div>
                    <div className="flex flex-1 gap-x-9">
                        <div className="infoContainer2 w-[50%]">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Budgets</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateBudgetModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-center flex-1 w-full">
                                {expenseCategoryIsLoading ? (
                                    <Loader />
                                ) : (
                                    <Table
                                        dark
                                        detailsFunction={(budgetId: number) =>
                                            showDetailsBudgetPlanningModal(budgetId)
                                        }
                                        data={budgetExpensesData}
                                        tablePrefix="BE"
                                        rowLimit={5}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="infoContainer2 w-[50%]">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Expense Categories</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateExpenseCategoryModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-center flex-1 w-full">
                                {expenseCategoryIsLoading ? (
                                    <Loader />
                                ) : (
                                    <Table
                                        data={expenseCategoryTableData}
                                        detailsFunction={(expenseCategoryId: number) =>
                                            showDetailsExpenseCategoryModal(expenseCategoryId)
                                        }
                                        tablePrefix="E"
                                        dark
                                        rowLimit={5}
                                    />
                                )}
                            </div>
                        </div>
                        {/* <div className="infoContainer2 flex-1">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Fixed Expenses</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateFixedExpenseModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-center flex-1 w-full">
                                {expenseCategoryIsLoading ? (
                                    <Loader />
                                ) : (
                                    <Table
                                        data={fixedExpensesData}
                                        detailsFunction={(fixedExpenseId: number) =>
                                            showDetailsFixedExpenseModal(fixedExpenseId)
                                        }
                                        tablePrefix="E"
                                        dark
                                        rowLimit={6}
                                    />
                                )}
                            </div>
                        </div> */}
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
            {/* Create Fixed Expense Modal */}
            {/* <CreateModal show={createModalState.fixedExpense} createFunction={createFixedExpenseHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <SelectField
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues}
                />
                <DetailsField fieldStateHandler={setDetails} />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={fixedExpensesData.columns[2].values!}
                />
            </CreateModal> */}
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
            {/* Fixed Expense Details Modal */}
            {/* <DetailsModal
                updateFunction={updateFixedExpenseHandler}
                deleteFunction={deleteFixedExpenseHandler}
                show={detailsModalState.show.fixedExpense}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={fixedExpensesData.columns[2].values!}
                    defaultValue={periodicity}
                />
                <SelectField
                    defaultValue={selectValue}
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues!}
                />
            </DetailsModal> */}
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
        </div>
    );
}
