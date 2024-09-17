import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table, { tableRow } from "../components/Table";
import { dataObject } from "../components/Table";
import {
    useGetIncomesByUserIdQuery,
    useGetFixedIncomesByUserIdQuery,
    createIncomeDto,
    useCreateIncomeMutation,
    useLazyGetIncomesByIdQuery,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
    useCreateFixedIncomeMutation,
    createFixedIncomeDto,
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
    const { data: iData, error: iError, isLoading: iIsLoading } = useGetIncomesByUserIdQuery(1);
    const [getIncomeById, incomeByIdResult, lastPromiseInfo] = useLazyGetIncomesByIdQuery();
    const [createIncome, incomeCreateResult] = useCreateIncomeMutation();

    const showCreateIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.income = true;

        dispatch(showCreateModal(newState));
    };
    const showDetailsIncomeModal = (incomeId) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = incomeId;
        newState.show = { ...detailsModalState.show, income: true };

        dispatch(showDetailsModal(newState));
    };
    const createIncomeHandler = () => {
        const incomeData: createIncomeDto = {
            amount: amount,
            details: details,
            date: date,
        };
        createIncome(incomeData);
    };

    //Fixed Income Handling
    const { data: fiData, error: fiError, isLoading: fiIsLoading } = useGetFixedIncomesByUserIdQuery(1);
    const [createFixedIncome, fiResult] = useCreateFixedIncomeMutation();

    const showCreateFixedIncomeModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.fixedIncome = true;

        dispatch(showModal(newState));
    };
    const createFixedIncomeHandler = () => {
        const fixedIncomeData: createFixedIncomeDto = {
            amount: amount,
            details: details,
            periodicity: periodicity,
        };
        createFixedIncome(fixedIncomeData);
    };

    let incomesRow: tableRow, fixedIncomesRow: tableRow;

    if (!iIsLoading && iData != undefined) {
        incomesRow = iData.map((income: { id: number; amount: number; details: string; date: Date }) => ({
            id: income.id,
            data: [income.amount, income.details, new Date(income.date).toLocaleDateString("en-US")],
        }));
    }

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
                            <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                        </div>
                        <div className="flex gap-x-9 h-[18%]">
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>January Income</p>
                                <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                            </div>
                            <div className="infoContainer1 flex-1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none">
                                <p>2024 Income</p>
                                <h1 className="font-light text-5xl my-auto">RD$750K</h1>
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
                                <Table data={fixedIncomeData} tablePrefix="FI" dark />
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
                    values={fixedIncomeData.columns[2].values}
                />
            </CreateModal>
            <DetailsModal show={detailsModalState.show.income}>
                <AmountField fieldStateHandler={setAmount} />
                <DetailsField fieldStateHandler={setDetails} />
                <DateField fieldStateHandler={setDate} />
            </DetailsModal>
        </div>
    );
}
