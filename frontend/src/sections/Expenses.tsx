import { useState } from "react";
import SectionContent from "../components/Layout/SectionContent";
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
} from "../api/apiSlice";
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
import CustomPieChart, { pieChartSlice } from "../components/Graphs/CustomPieChart";
import ValuePill from "../components/Misc/ValuePill";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import ProgressBar from "../components/Graphs/ProgressBar";

export default function Expenses() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date | string>(new Date());
    const [periodicity, setPeriodicity] = useState<number | null>(null);
    const [selectValue, setSelectValue] = useState<number | null>(0);

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    const categorySelectValues:
        | {
              id: number | null;
              value: string;
          }[]
        | undefined = [{ id: null, value: "Others" }];
    let expensesRow: tableRow[] = [];

    let budgetExpensesRow: tableRow[] = [],
        expenseCategoriesRow: tableRow[] = [],
        dataPieChart: pieChartSlice[] = [],
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
                    expense.expenseCategoryId != null
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
    const createExpenseHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");
        if (selectValue === 0) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const expenseData: createExpenseDto = {
            amount: amount,
            details: details,
            date: date,
            expenseCategoryId: selectValue,
        };

        await createExpense(expenseData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error creating expense`);
            });
    };

    // Create budget plan function
    const createBudgetHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (periodicity === null) errors.push("Periodicity must be selected");
        if (selectValue === 0) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const budgetPlanData: createBudgetPlanDto = {
            amount: amount,
            expenseCategoryId: selectValue!,
            periodicity: periodicity!,
        };

        await createBudgetPlan(budgetPlanData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error creating budget`);
            });
    };

    // Create expense category function
    const createExpenseCategoryHandler = async () => {
        const errors: string[] = [];
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const expenseCategoryData: createExpenseCategoryDto = {
            category: details,
        };

        await createExpenseCategory(expenseCategoryData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error creating category`);
            });
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
    const updateExpenseHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        console.log(amount, details, date);
        if (details.trim() === "") errors.push("Details cannot be empty");
        if (date === null) errors.push("Date cannot be empty");
        if (selectValue === 0) errors.push("Category must be selected");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const expenseData: updateExpenseDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, date: date, expenseCategoryId: selectValue },
        };

        await updateExpense(expenseData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error updating expense`);
            });
    };

    // Update Budget Plan Function
    const updateBudgetPlanHandler = async () => {
        const errors: string[] = [];
        if (amount <= 0 || !amount) errors.push("Amount must be greater than 0");
        if (periodicity === null) errors.push("Periodicity must be selected");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const budgetPlanData: updateBudgetPlanDto = {
            id: detailsModalState.id!,
            data: { amount: amount, periodicity: periodicity! },
        };

        await updateBudgetPlan(budgetPlanData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error updating budget`);
            });
    };

    // Update Expense Category Function
    const updateExpenseCategoryHandler = async () => {
        const errors: string[] = [];
        if (details.trim() === "") errors.push("Details cannot be empty");

        if (errors.length > 0) {
            throw new Error(errors.join(","));
        }

        const expenseCategoryData: updateExpenseCategoryDto = {
            id: detailsModalState.id!,
            data: { category: details },
        };

        await updateExpenseCategory(expenseCategoryData)
            .unwrap()
            .catch(() => {
                throw new Error(`Error updating category`);
            });
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
            <button
                className="border-2 rounded-md p-2"
                key={e.id}
                onClick={() => showDetailsExpenseModal(e.id)}
            >
                <div className="flex justify-between gap-16">
                    <p className="font-bold text-ellipsis overflow-hidden text-nowrap">{e.details}</p>
                    <p className="font-bold">RD${e.amount}</p>
                </div>
                <div className="flex justify-between">
                    <p>
                        {e.expenseCategoryId != null
                            ? expenseCategoryData?.find((ec) => ec.id === e.expenseCategoryId)!.category
                            : "Others"}
                    </p>
                    <p>{new Date(e.date).toDateString()}</p>
                </div>
            </button>
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-8 overflow-x-hidden overflow-y-auto md:grid-cols-5 xl:grid-cols-7 2xl:max-h-[1000px] 2xl:flex-1 2xl:grid-rows-12">
                    <div className="flex col-span-2 gap-3 md:hidden">
                        <div className="flex-1">
                            <ValuePill title={currentMonth} value={totalMonthExpenses} />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearExpenses} />
                        </div>
                    </div>
                    <hr className="col-span-2 border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 max-md:hidden md:col-span-3 xl:col-span-3 2xl:row-span-5">
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
                    <div className="infoContainer1 col-span-2 md:col-span-5 md:order-3 xl:col-span-4 2xl:row-span-7">
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
                                <div className="flex flex-1 w-full max-h-[40rem] max-md:hidden xl:max-h-96 2xl:max-h-none overflow-hidden">
                                    <Table
                                        data={expensesData}
                                        detailsFunction={(expenseId: number) =>
                                            showDetailsExpenseModal(expenseId)
                                        }
                                    />
                                </div>
                                <div className="flex flex-col w-full overflow-x-hidden gap-4 max-h-[40rem] overflow-y-auto md:hidden">
                                    <ExpenseCards />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="infoContainer2 col-span-2 md:col-span-5 md:order-4 xl:order-2 xl:col-span-4 2xl:row-span-5">
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
                                <div className=" max-md:hidden flex flex-1 w-full max-h-[40rem] xl:max-h-52 2xl:max-h-none overflow-hidden">
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
                    <div className="infoContainer2 col-span-2 md:col-span-2 md:order-2 xl:col-span-3 xl:order-4 2xl:row-span-7">
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
                        <div className="flex flex-1 w-full max-h-96 md:max-h-52 xl:max-h-96 2xl:max-h-none overflow-hidden">
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
                        (cs) =>
                            cs.id !== null && !expenseCategoriesWithBudget.some((ec) => ec.id === cs.id)
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
