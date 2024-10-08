import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table, { tableRow } from "../components/Table";
import { dataObject } from "../components/Table";
import {
    useGetIncomesByUserIdQuery,
    useCreateIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
    incomeDto,
    updateIncomeDto,
    createIncomeDto,
    useGetFixedIncomesByUserIdQuery,
    useCreateFixedIncomeMutation,
    useDeleteFixedIncomeMutation,
    useUpdateFixedIncomeMutation,
    fixedIncomeDto,
    updateFixedIncomeDto,
    createFixedIncomeDto,
    useGetExpenseCategoryBudgetByUserIdQuery,
    expenseCategoryDto,
    createBudgetPlanDto,
    updateBudgetPlanDto,
    useCreateBudgetPlanMutation,
    useDeleteBudgetPlanMutation,
    useUpdateBudgetPlanMutation,
} from "../../api/apiSlice";
import { periodicityValues } from "../components/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateModal from "../components/CreateModal";
import DetailsModal from "../components/DetailsModal";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import { AmountField, DateField, DetailsField, ListField, SelectField } from "../components/ModalsFields";

export default function Budget() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<number>(0);

    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date()), setPeriodicity(0), setSelectValue(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    let incomesRow: tableRow[], fixedIncomesRow: tableRow[], budgetPlanningRow: tableRow[];
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    let totalIncome: number = 0;
    let totalMonthIncome: number = 0;
    let totalYearIncome: number = 0;
    let categorySelectValues: { id: number; value: string; budgetPlan: boolean }[] | undefined;

    //Income Handling
    const { data: incomeData, isLoading: incomeIsLoading } = useGetIncomesByUserIdQuery(1);
    const [createIncome] = useCreateIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    //Fixed Income Handling
    const { data: fixedIncomeData, isLoading: fixedIncomeIsLoading } = useGetFixedIncomesByUserIdQuery(1);
    const [createFixedIncome] = useCreateFixedIncomeMutation();
    const [deleteFixedIncome] = useDeleteFixedIncomeMutation();
    const [updateFixedIncome] = useUpdateFixedIncomeMutation();

    //Budget Plan Handling
    const { data: budgetPlanningData, isLoading: budgetPlanningIsLoading } =
        useGetExpenseCategoryBudgetByUserIdQuery(1);
    const [createBudgetPlan] = useCreateBudgetPlanMutation();
    const [deleteBudgetPlan] = useDeleteBudgetPlanMutation();
    const [updateBudgetPlan] = useUpdateBudgetPlanMutation();

    // Show create Income Modal
    const showCreateIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.income = true;

        dispatch(showCreateModal(newState));
    };

    // Show create Fixed Income Modal
    const showCreateFixedIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.fixedIncome = true;

        dispatch(showCreateModal(newState));
    };

    // Show create budget planning Modal
    const showCreateBudgetModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.budgetPlanning = true;

        dispatch(showCreateModal(newState));
    };

    // Show details Income Modal
    const showDetailsIncomeModal = (incomeId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = incomeId;
        newState.show = { ...detailsModalState.show, income: true };

        const selectedIncomeData: incomeDto = incomeData.filter((i: incomeDto) => i.id === incomeId)[0];

        setAmount(selectedIncomeData.amount);
        setDetails(selectedIncomeData.details);
        setDate(selectedIncomeData.date);
        dispatch(showDetailsModal(newState));
    };

    // Show details Fixed Income Modal
    const showDetailsFixedIncomeModal = (fixedIncomeId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = fixedIncomeId;
        newState.show = { ...detailsModalState.show, fixedIncome: true };

        const selectedFixedIncomeData: fixedIncomeDto = fixedIncomeData.filter(
            (i: fixedIncomeDto) => i.id === fixedIncomeId
        )[0];

        setAmount(selectedFixedIncomeData.amount);
        setDetails(selectedFixedIncomeData.details);
        setPeriodicity(selectedFixedIncomeData.periodicity);

        dispatch(showDetailsModal(newState));
    };

    // Show details Budget Plan Modal
    const showDetailsBudgetPlanningModal = (budgetId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = budgetId;
        newState.show = { ...detailsModalState.show, budgetPlanning: true };

        const budgetData: expenseCategoryDto = budgetPlanningData.filter(
            (ec: expenseCategoryDto) => ec.budgetPlan?.id === budgetId
        )[0];

        setAmount(budgetData.budgetPlan!.amount);
        setSelectValue(budgetData.id);
        setPeriodicity(budgetData.budgetPlan!.periodicity);

        dispatch(showDetailsModal(newState));
    };

    // Create Income Function
    const createIncomeHandler = () => {
        const incomeData: createIncomeDto = {
            amount: amount,
            details: details,
            date: date,
        };
        createIncome(incomeData);
    };

    // Create Fixed income function
    const createFixedIncomeHandler = () => {
        const fixedIncomeData: createFixedIncomeDto = {
            amount: amount,
            details: details,
            periodicity: periodicity,
        };
        createFixedIncome(fixedIncomeData);
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

    // Delete Income Function
    const deleteIncomeHandler = () => {
        const incomeId = detailsModalState.id;
        deleteIncome(incomeId!);
    };

    // Delete Fixed Income Function
    const deleteFixedIncomeHandler = () => {
        const fixedIncomeId = detailsModalState.id;
        deleteFixedIncome(fixedIncomeId!);
    };

    // Delete Budget Plan Function
    const deleteBudgetPlanHandler = () => {
        const budgetPlanId = detailsModalState.id;
        deleteBudgetPlan(budgetPlanId!);
    };

    // Update Income Function
    const updateIncomeHandler = () => {
        const incomeData: updateIncomeDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, date: date },
        };

        updateIncome(incomeData);
    };

    // Update Fixed Income Function
    const updateFixedIncomeHandler = () => {
        const fixedIncomeData: updateFixedIncomeDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, periodicity: periodicity },
        };

        updateFixedIncome(fixedIncomeData);
    };

    // Update Budget Plan Function
    const updateBudgetPlanHandler = () => {
        const budgetPlanData: updateBudgetPlanDto = {
            id: detailsModalState.id!,
            data: { amount: amount, periodicity: periodicity },
        };

        updateBudgetPlan(budgetPlanData);
    };

    // Income data handling
    if (!incomeIsLoading && incomeData != undefined) {
        incomesRow = incomeData.map((income: incomeDto) => ({
            id: income.id,
            data: [income.amount, income.details, new Date(income.date).toLocaleDateString("en-US")],
        }));

        totalIncome = incomeData.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);

        const monthIncomes = incomeData.filter(
            (income) => new Date(income.date).getMonth() === currentDate.getMonth()
        );

        const yearIncomes = incomeData.filter(
            (income) => new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        totalMonthIncome = monthIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);
        totalYearIncome = yearIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);
    }

    // Fixed Income data handling
    if (!fixedIncomeIsLoading && fixedIncomeData != undefined) {
        fixedIncomesRow = fixedIncomeData.map((fixedIncome: fixedIncomeDto) => ({
            id: fixedIncome.id,
            data: [fixedIncome.amount, fixedIncome.details, fixedIncome.periodicity],
        }));
    }

    //budget Planning data handling
    if (!budgetPlanningIsLoading && budgetPlanningData != undefined) {
        const expenseCategoriesWithBudgets = budgetPlanningData.filter((ec) => ec.budgetPlan);

        budgetPlanningRow = expenseCategoriesWithBudgets.map((expenseCategory: expenseCategoryDto) => ({
            id: expenseCategory.budgetPlan!.id,
            data: [
                expenseCategory.category,
                expenseCategory.budgetPlan!.amount,
                expenseCategory.budgetPlan!.periodicity,
            ],
        }));

        categorySelectValues = budgetPlanningData.map((ec: expenseCategoryDto) => ({
            id: ec.id,
            value: ec.category,
            budgetPlan: ec.budgetPlan ? true : false,
        }));
    }

    //Income table structure
    const incomeTableData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: incomesRow ?? [
            {
                id: 1500,
                data: [2500, "pepe", "23/25/2024"],
            },
        ],
    };

    //Fixed Income table structure
    const fixedIncomeTableData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            {
                name: "Periodicity",
                type: "list",
                values: periodicityValues,
            },
        ],
        rows: fixedIncomesRow ?? [
            {
                id: 1500,
                data: [2500, "pepe", 1],
            },
        ],
    };

    //Budget Planning table structure
    const budgetPlanningTableData: dataObject = {
        columns: [
            { name: "Category", type: "string" },
            { name: "Amount", type: "amount" },
            {
                name: "Periodicity",
                type: "list",
                values: periodicityValues,
            },
        ],
        rows: budgetPlanningRow ?? [
            {
                id: 1500,
                data: ["pepe", 2500, 2],
            },
        ],
    };

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Income" />
            <SectionContent>
                <Header currentSection="Income" />
                <div className="flex-1 flex overflow-hidden gap-x-9">
                    <div className="flex flex-col w-5/12 gap-y-9">
                        <div className="infoContainer1 h-[18%]">
                            <p>Total Income</p>
                            <h1 className="font-light text-5xl my-auto">RD${totalIncome}</h1>
                        </div>
                        <div className="flex gap-x-9 h-[18%]">
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>{`${currentMonth} Income`}</p>
                                <h1 className="font-light text-5xl my-auto">RD${totalMonthIncome}</h1>
                            </div>
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>{`${currentYear} Income`}</p>
                                <h1 className="font-light text-5xl my-auto">RD${totalYearIncome}</h1>
                            </div>
                        </div>
                        <div className="infoContainer1 flex-1">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Budget Planning</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateBudgetModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex flex-1 items-center w-full">
                                <Table
                                    data={budgetPlanningTableData}
                                    tablePrefix="BP"
                                    detailsFunction={(budgetId: number) =>
                                        showDetailsBudgetPlanningModal(budgetId)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-9">
                        <div className="infoContainer2 h-[50%]">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Income</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateIncomeModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-center flex-1 w-full">
                                <Table
                                    dark
                                    data={incomeTableData}
                                    tablePrefix="I"
                                    detailsFunction={(incomeId: number) =>
                                        showDetailsIncomeModal(incomeId)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex-1 infoContainer2">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Fixed Income</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateFixedIncomeModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex flex-1 items-center w-full">
                                <Table
                                    data={fixedIncomeTableData}
                                    tablePrefix="FI"
                                    dark
                                    detailsFunction={(fixedIncomeId: number) =>
                                        showDetailsFixedIncomeModal(fixedIncomeId)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
            {/* Create Income Modal */}
            <CreateModal show={createModalState.income} createFunction={createIncomeHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <DetailsField fieldStateHandler={setDetails} />
                <DateField fieldStateHandler={setDate} />
            </CreateModal>
            {/* Create Fixed Income Modal */}
            <CreateModal show={createModalState.fixedIncome} createFunction={createFixedIncomeHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <DetailsField fieldStateHandler={setDetails} />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={fixedIncomeTableData.columns[2].values!}
                />
            </CreateModal>
            {/* Create Budget Modal */}
            <CreateModal show={createModalState.budgetPlanning} createFunction={createBudgetHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <SelectField
                    fieldStateHandler={setSelectValue}
                    label="Category"
                    values={categorySelectValues?.filter((ec) => !ec.budgetPlan)}
                />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={budgetPlanningTableData.columns[2].values!}
                />
            </CreateModal>
            {/* Details Income Modal */}
            <DetailsModal
                updateFunction={updateIncomeHandler}
                deleteFunction={deleteIncomeHandler}
                show={detailsModalState.show.income}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <DateField defaultValue={date} fieldStateHandler={setDate} />
            </DetailsModal>
            {/* Details Fixed Income Modal */}
            <DetailsModal
                updateFunction={updateFixedIncomeHandler}
                deleteFunction={deleteFixedIncomeHandler}
                show={detailsModalState.show.fixedIncome}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={fixedIncomeTableData.columns[2].values!}
                    defaultValue={periodicity}
                />
            </DetailsModal>
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
                    values={categorySelectValues}
                />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={budgetPlanningTableData.columns[2].values!}
                    defaultValue={periodicity}
                />
            </DetailsModal>
        </div>
    );
}
