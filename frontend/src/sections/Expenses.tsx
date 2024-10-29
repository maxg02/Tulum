import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { PieChart } from "@mui/x-charts/PieChart";
import { gradientColors } from "../components/Colors";
import DiamondList from "../components/DiamondList";
import Table, { dataObject, tableRow } from "../components/Table";
import {
    expenseDto,
    createExpenseDto,
    expenseCategoryDto,
    updateExpenseDto,
    useCreateExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseCategoryFullByUserIdQuery,
    useUpdateExpenseMutation,
    fixedExpenseDto,
    createFixedExpenseDto,
    useCreateFixedExpenseMutation,
    useDeleteFixedExpenseMutation,
    useUpdateFixedExpenseMutation,
    updateFixedExpenseDto,
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

export default function Expenses() {
    const [highlightedValue, setHighlightedValue] = useState(null);
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number>(0);

    type pieChartSlice = {
        label: string;
        value: number;
    };

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();

    let expensesRow: tableRow[] = [],
        fixedExpensesRow: tableRow[] = [],
        budgetExpensesRow: tableRow[] = [],
        allExpenses: expenseDto[] | undefined = [],
        allFixedExpenses: fixedExpenseDto[] | undefined = [],
        monthExpensesData: pieChartSlice[] = [],
        categorySelectValues:
            | {
                  id: number;
                  value: string;
                  budgetPlan: boolean;
                  expense: boolean;
                  fixedExpense: boolean;
              }[]
            | undefined;
    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date()), setPeriodicity(0), setSelectValue(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    //Expense Category Handling
    const { data: expenseCategoryData, isLoading: expenseCategoryIsLoading } =
        useGetExpenseCategoryFullByUserIdQuery(1);

    //Expense Handling
    const [createExpense] = useCreateExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();

    //Fixed Expense Handling
    const [createFixedExpense] = useCreateFixedExpenseMutation();
    const [deleteFixedExpense] = useDeleteFixedExpenseMutation();
    const [updateFixedExpense] = useUpdateFixedExpenseMutation();

    // Expenses Category Data handling
    if (!expenseCategoryIsLoading && expenseCategoryData != undefined) {
        expenseCategoryData
            .filter((eC: expenseCategoryDto) => eC.expenses!.length)
            .map((eC: expenseCategoryDto) =>
                eC.expenses!.map((e) => {
                    expensesRow.push({
                        id: e.id,
                        data: [
                            e.amount,
                            e.details,
                            new Date(e.date).toLocaleDateString("en-US"),
                            eC.category,
                        ],
                    });
                })
            );

        expenseCategoryData
            .filter((eC: expenseCategoryDto) => eC.fixedExpenses!.length)
            .map((eC: expenseCategoryDto) =>
                eC.fixedExpenses!.map((fe) => {
                    fixedExpensesRow.push({
                        id: fe.id,
                        data: [fe.amount, fe.details, fe.periodicity, eC.category],
                    });
                })
            );

        categorySelectValues = expenseCategoryData.map((ec: expenseCategoryDto) => ({
            id: ec.id,
            value: ec.category,
            budgetPlan: ec.budgetPlan ? true : false,
            expense: ec.expenses!.length ? true : false,
            fixedExpense: ec.expenses!.length ? true : false,
        }));

        allExpenses = expenseCategoryData
            ?.map((ec) => ec.expenses)
            .reduce((acc, currentValue) => acc!.concat(currentValue!));

        allFixedExpenses = expenseCategoryData
            ?.map((ec) => ec.fixedExpenses)
            .reduce((acc, currentValue) => acc!.concat(currentValue!));

        const monthExpenses = allExpenses?.filter(
            (expense) => new Date(expense.date).getMonth() === currentDate.getMonth()
        );

        const monthExpensesByCategory: object = Object.groupBy(
            monthExpenses,
            (expense) => expense.expenseCategoryId
        );

        monthExpensesData = Object.keys(monthExpensesByCategory).map((key) => ({
            label: categorySelectValues?.find((c) => c.id === parseInt(key))?.value,
            value: monthExpensesByCategory[key].reduce((acc, expense) => acc + expense.amount, 0),
        }));

        budgetExpensesRow = expenseCategoryData
            .filter((ec) => ec.budgetPlan)
            .map((expenseCategory: expenseCategoryDto) => ({
                id: expenseCategory.budgetPlan!.id,
                data: [
                    expenseCategory.category,
                    {
                        value: monthExpensesData.find((ec) => ec.label === expenseCategory.category)
                            ?.value,
                        total: expenseCategory.budgetPlan!.amount,
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

    // Show create Fixed Expense Modal
    const showCreateFixedExpenseModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.fixedExpense = true;

        dispatch(showCreateModal(newState));
    };

    //Show details Expense Modal
    const showDetailsExpenseModal = (expenseId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = expenseId;
        newState.show = { ...detailsModalState.show, expense: true };

        const selectedExpenseData = allExpenses!.find((exp) => exp.id === expenseId);

        setAmount(selectedExpenseData!.amount);
        setDetails(selectedExpenseData!.details);
        setDate(selectedExpenseData!.date);
        setSelectValue(selectedExpenseData!.expenseCategoryId);
        dispatch(showDetailsModal(newState));
    };

    //Show details Fixed Expense Modal
    const showDetailsFixedExpenseModal = (fixedExpenseId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = fixedExpenseId;
        newState.show = { ...detailsModalState.show, fixedExpense: true };

        const selectedFixedExpenseData = allFixedExpenses!.find((fExp) => fExp.id === fixedExpenseId);

        setAmount(selectedFixedExpenseData!.amount);
        setDetails(selectedFixedExpenseData!.details);
        setPeriodicity(selectedFixedExpenseData!.periodicity);
        setSelectValue(selectedFixedExpenseData!.expenseCategoryId);
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

    // Create fixed expense function
    const createFixedExpenseHandler = () => {
        const fixedExpenseData: createFixedExpenseDto = {
            amount: amount,
            details: details,
            periodicity: periodicity,
            expenseCategoryId: selectValue,
        };
        createFixedExpense(fixedExpenseData);
    };

    // Delete Expense Function
    const deleteExpenseHandler = () => {
        const expenseId = detailsModalState.id;
        deleteExpense(expenseId!);
    };

    // Delete Fixed Expense Function
    const deleteFixedExpenseHandler = () => {
        const fixedExpenseId = detailsModalState.id;
        deleteFixedExpense(fixedExpenseId!);
    };

    // Update Expense Function
    const updateExpenseHandler = () => {
        const expenseData: updateExpenseDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, date: date, expenseCategoryId: selectValue },
        };

        updateExpense(expenseData);
    };

    // Update Fixed Expense Function
    const updateFixedExpenseHandler = () => {
        const fixedExpenseData: updateFixedExpenseDto = {
            id: detailsModalState.id!,
            data: {
                amount: amount,
                details: details,
                periodicity: periodicity,
                expenseCategoryId: selectValue,
            },
        };

        updateFixedExpense(fixedExpenseData);
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

    const fixedExpensesData: dataObject = {
        columns: [
            { name: "Expense", type: "amount" },
            { name: "Details", type: "string" },
            {
                name: "Periodicity",
                type: "list",
                values: periodicityValues,
            },
            { name: "Category", type: "string" },
        ],
        rows: fixedExpensesRow,
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
                            <div className="w-full flex-1 flex items-center justify-center gap-x-9">
                                <div className="w-80 h-full relative">
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
                                                        data: dataPieChart,
                                                        id: "A",
                                                        innerRadius: "65%",
                                                        paddingAngle: 2,
                                                        cornerRadius: 3,
                                                        highlightScope: {
                                                            fade: "global",
                                                            highlight: "item",
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
                                                    trigger: "item",
                                                    classes: {
                                                        labelCell: "hidden",
                                                        valueCell: "ml-3 p-3",
                                                        markCell: "pl-3 pr-0",
                                                    },
                                                }}
                                            ></PieChart>
                                            <h2 className="font-light text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                {`RD$${
                                                    dataPieChart.reduce((acc, currentValue) => ({
                                                        ...currentValue,
                                                        value: acc.value + currentValue.value,
                                                    })).value
                                                }`}
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
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-x-9">
                        <div className="infoContainer2 w-5/12">
                            <p>Budget Expenses</p>
                            <div className="flex items-center flex-1 w-full">
                                <Table dark data={budgetExpensesData} tablePrefix="BE" />
                            </div>
                        </div>
                        <div className="infoContainer2 flex-1">
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
                                    />
                                )}
                            </div>
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
            {/* Create Fixed Expense Modal */}
            <CreateModal show={createModalState.fixedExpense} createFunction={createFixedExpenseHandler}>
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
            </CreateModal>
            {/* Fixed Expense Details Modal */}
            <DetailsModal
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
            </DetailsModal>
        </div>
    );
}
