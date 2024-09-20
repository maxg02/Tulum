import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table, { tableRow } from "../components/Table";
import { dataObject } from "../components/Table";
import {
    useGetIncomesByUserIdQuery,
    useGetFixedIncomesByUserIdQuery,
    createIncomeDto,
    incomeDto,
    useCreateIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
    useCreateFixedIncomeMutation,
    createFixedIncomeDto,
    updateIncomeDto,
    updateFixedIncomeDto,
    useDeleteFixedIncomeMutation,
    useUpdateFixedIncomeMutation,
    fixedIncomeDto,
} from "../../api/apiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateModal from "../components/CreateModal";
import DetailsModal from "../components/DetailsModal";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import { AmountField, DateField, DetailsField, ListField } from "../components/ModalsFields";

export default function Budget() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);

    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date());
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    //Income Handling
    const { data: iData, isLoading: iIsLoading } = useGetIncomesByUserIdQuery(1);
    const [createIncome] = useCreateIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    // Show create Income Modal
    const showCreateIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.income = true;

        dispatch(showCreateModal(newState));
    };

    // Show details Income Modal
    const showDetailsIncomeModal = (incomeId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = incomeId;
        newState.show = { ...detailsModalState.show, income: true };

        const incomeData = iData.filter((i: incomeDto) => i.id === incomeId)[0];

        setAmount(incomeData.amount);
        setDetails(incomeData.details);
        setDate(incomeData.date);
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

    // Delete Income Function
    const deleteIncomeHandler = () => {
        const incomeId = detailsModalState.id;
        deleteIncome(incomeId!);
    };

    // Update Income Function
    const updateIncomeHandler = () => {
        const incomeData: updateIncomeDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, date: date },
        };

        updateIncome(incomeData);
    };

    //Fixed Income Handling
    const { data: fiData, isLoading: fiIsLoading } = useGetFixedIncomesByUserIdQuery(1);
    const [createFixedIncome] = useCreateFixedIncomeMutation();
    const [deleteFixedIncome] = useDeleteFixedIncomeMutation();
    const [updateFixedIncome] = useUpdateFixedIncomeMutation();

    // Show create Fixed Income Modal
    const showCreateFixedIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.fixedIncome = true;

        dispatch(showCreateModal(newState));
    };

    const showDetailsFixedIncomeModal = (fixedIncomeId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = fixedIncomeId;
        newState.show = { ...detailsModalState.show, fixedIncome: true };

        const fixedIncomeData = fiData.filter((i: fixedIncomeDto) => i.id === fixedIncomeId)[0];

        setAmount(fixedIncomeData.amount);
        setDetails(fixedIncomeData.details);
        setPeriodicity(fixedIncomeData.periodicity);

        dispatch(showDetailsModal(newState));
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

    // Delete Fixed Income Function
    const deleteFixedIncomeHandler = () => {
        const fixedIncomeId = detailsModalState.id;
        deleteFixedIncome(fixedIncomeId!);
    };

    // Update Fixed Income Function
    const updateFixedIncomeHandler = () => {
        const fixedIncomeData: updateFixedIncomeDto = {
            id: detailsModalState.id!,
            data: { amount: amount, details: details, periodicity: periodicity },
        };

        updateFixedIncome(fixedIncomeData);
    };

    let incomesRow: tableRow, fixedIncomesRow: tableRow;
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    let totalIncome: number = 0;
    let totalMonthIncome: number = 0;
    let totalYearIncome: number = 0;

    // Income data handling
    if (!iIsLoading && iData != undefined) {
        incomesRow = iData.map((income: { id: number; amount: number; details: string; date: Date }) => ({
            id: income.id,
            data: [income.amount, income.details, new Date(income.date).toLocaleDateString("en-US")],
        }));

        totalIncome = iData.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);

        const monthIncomes = iData.filter(
            (income) => new Date(income.date).getMonth() === currentDate.getMonth()
        );

        const yearIncomes = iData.filter(
            (income) => new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        totalMonthIncome = monthIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);
        totalYearIncome = yearIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);
    }

    // Fixed Income data handling
    if (!fiIsLoading && fiData != undefined) {
        fixedIncomesRow = fiData.map(
            (fIncome: { id: number; amount: number; details: string; periodicity: string }) => ({
                id: fIncome.id,
                data: [fIncome.amount, fIncome.details, fIncome.periodicity],
            })
        );
    }

    const incomeData: dataObject = {
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

    const fixedIncomeData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            {
                name: "Periodicity",
                type: "list",
                values: ["Daily", "Weekly", "Biweekly", "Monthly", "Quarterly", "Annual"],
            },
        ],
        rows: fixedIncomesRow ?? [
            {
                id: 1500,
                data: [2500, "pepe", 1],
            },
        ],
    };

    // const budgetPlanningData: dataObject = {
    //     columns: [
    //         { name: "Details", type: "string" },
    //         { name: "Amount", type: "amount" },
    //         {
    //             name: "Periodicity",
    //             type: "list",
    //             values: ["Daily", "Weekly", "Biweekly", "Monthly", "Quarterly", "Annual"],
    //         },
    //     ],
    //     rows: [
    //         {
    //             id: 1500,
    //             data: ["pepe", 2500, 2],
    //         },
    //     ],
    // };

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
                            <p>Budget Planning</p>
                            {/* <div className="flex flex-1 items-center w-full">
                                <Table data={budgetPlanningData} tablePrefix="BP" />
                            </div> */}
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
                                    data={incomeData}
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
                                    data={fixedIncomeData}
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
            <CreateModal show={createModalState.income} createFunction={createIncomeHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <DetailsField fieldStateHandler={setDetails} />
                <DateField fieldStateHandler={setDate} />
            </CreateModal>
            <CreateModal show={createModalState.fixedIncome} createFunction={createFixedIncomeHandler}>
                <AmountField fieldStateHandler={setAmount} />
                <DetailsField fieldStateHandler={setDetails} />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={fixedIncomeData.columns[2].values!}
                />
            </CreateModal>
            <DetailsModal
                updateFunction={updateIncomeHandler}
                deleteFunction={deleteIncomeHandler}
                show={detailsModalState.show.income}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <DateField defaultValue={date} fieldStateHandler={setDate} />
            </DetailsModal>
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
                    values={fixedIncomeData.columns[2].values!}
                    defaultValue={periodicity}
                />
            </DetailsModal>
        </div>
    );
}
