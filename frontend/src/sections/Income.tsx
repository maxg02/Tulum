import { useState } from "react";
import SectionContent from "../components/Layout/SectionContent";
import Table, { tableRow } from "../components/Misc/Table";
import { dataObject } from "../components/Misc/Table";
import {
    useGetUserIncomesQuery,
    useCreateIncomeMutation,
    useDeleteIncomeMutation,
    useUpdateIncomeMutation,
    incomeDto,
    updateIncomeDto,
    createIncomeDto,
    useGetUserFixedIncomesQuery,
    useCreateFixedIncomeMutation,
    useDeleteFixedIncomeMutation,
    useUpdateFixedIncomeMutation,
    fixedIncomeDto,
    updateFixedIncomeDto,
    createFixedIncomeDto,
} from "../../api/apiSlice";
import { monthList, periodicityValues } from "../Constants/Constants";
import CreateModal from "../components/Modals/CreateModal";
import DetailsModal from "../components/Modals/DetailsModal";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import { AmountField, DateField, DetailsField, ListField } from "../components/Modals/ModalsFields";
import Loader from "../components/Misc/Loader";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis/axisClasses";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { basicColors } from "../Constants/Colors";
import ValuePill from "../components/Misc/ValuePill";

export default function Budget() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    //const [incomeToggle, setIncomeToggle] = useState<boolean>(true);

    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date()), setPeriodicity(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    let incomesRow: tableRow[] = [],
        fixedIncomesRow: tableRow[] = [];
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    let totalIncome: number = 0;
    let totalMonthIncome: number = 0;
    let totalYearIncome: number = 0;
    let totalFixedIncome: number = 0;
    let dataBarChart: {
        month: string;
        income: number;
    }[] = [];

    //Income Fetching
    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();
    const [createIncome] = useCreateIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    //Fixed Income Fetching
    const { data: fixedIncomeData, isLoading: fixedIncomeIsLoading } = useGetUserFixedIncomesQuery();
    const [createFixedIncome] = useCreateFixedIncomeMutation();
    const [deleteFixedIncome] = useDeleteFixedIncomeMutation();
    const [updateFixedIncome] = useUpdateFixedIncomeMutation();

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

    // Show details Income Modal
    const showDetailsIncomeModal = (incomeId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = incomeId;
        newState.show = { ...detailsModalState.show, income: true };

        const selectedIncomeData: incomeDto = incomeData!.filter((i: incomeDto) => i.id === incomeId)[0];

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

        const selectedFixedIncomeData: fixedIncomeDto = fixedIncomeData!.filter(
            (i: fixedIncomeDto) => i.id === fixedIncomeId
        )[0];

        setAmount(selectedFixedIncomeData.amount);
        setDetails(selectedFixedIncomeData.details);
        setPeriodicity(selectedFixedIncomeData.periodicity);

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

    // Income data handling
    if (!incomeIsLoading && incomeData != undefined) {
        incomesRow = incomeData.map((income: incomeDto) => ({
            id: income.id,
            data: [income.amount, income.details, new Date(income.date).toLocaleDateString("en-US")],
        }));

        totalIncome = incomeData.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);

        const monthIncomes = incomeData.filter(
            (income) =>
                new Date(income.date).getMonth() === currentDate.getMonth() &&
                new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        const yearIncomes = incomeData.filter(
            (income) => new Date(income.date).getFullYear() === currentDate.getFullYear()
        );

        totalMonthIncome = monthIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);
        totalYearIncome = yearIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0);

        dataBarChart = monthList.map((month) => ({
            month,
            income: yearIncomes
                .filter(
                    (income: incomeDto) =>
                        new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                            new Date(income.date)
                        ) == month
                )
                .reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
        }));
    }

    //Income table structure
    const incomeTableData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: incomesRow,
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
        rows: fixedIncomesRow,
    };

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-3 overflow-x-hidden overflow-y-auto max-h-[1000px] md:grid-cols-6 md:gap-6 2xl:flex-1 2xl:grid-rows-12">
                    <div className="flex-1 md:col-span-2 2xl:row-span-2">
                        <ValuePill title={currentMonth} value={totalMonthIncome} />
                    </div>
                    <div className="flex-1 md:col-span-2 2xl:row-span-2">
                        <ValuePill title={currentYear.toString()} value={totalYearIncome} />
                    </div>
                    <div className="flex-1 col-span-2 2xl:row-span-2">
                        <ValuePill title="Total" value={totalIncome} />
                    </div>

                    <hr className="col-span-2 my-4 border-t-2 md:hidden"></hr>

                    <div className="infoContainer1 flex-1 col-span-2 mb-6 md:col-span-6 md:mb-0 xl:col-span-3 2xl:row-span-10">
                        <div className="grid grid-cols-3 w-full">
                            <p className="col-start-2 mx-auto">Income</p>
                            <button
                                className="ml-auto tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                                onClick={showCreateIncomeModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex items-start flex-1 w-full">
                            {incomeIsLoading ? (
                                <Loader />
                            ) : (
                                <Table
                                    data={incomeTableData}
                                    tablePrefix="I"
                                    detailsFunction={(incomeId: number) =>
                                        showDetailsIncomeModal(incomeId)
                                    }
                                    rowLimit={18}
                                />
                            )}
                        </div>
                    </div>

                    <div className="infoContainer2 flex-1 col-span-2 md:col-span-6 xl:col-span-3 2xl:row-span-10">
                        <p className="col-start-2 mx-auto">Income Summary {currentYear}</p>
                        <div className="flex h-96 w-full xl:h-[30rem] 2xl:h-full">
                            {incomeIsLoading ? (
                                <Loader />
                            ) : (
                                <BarChart
                                    dataset={dataBarChart}
                                    margin={{ left: 35, right: 10, top: 15, bottom: 20 }}
                                    xAxis={[
                                        {
                                            valueFormatter: (value) =>
                                                value > 1000 ? `${value / 1000}K` : `${value}`,
                                        },
                                    ]}
                                    yAxis={[{ scaleType: "band", dataKey: "month" }]}
                                    series={[
                                        {
                                            dataKey: "income",
                                            valueFormatter: (v) => `RD$${v}`,
                                            color: basicColors.secondary,
                                        },
                                    ]}
                                    layout="horizontal"
                                    grid={{ vertical: true }}
                                    sx={{
                                        [`.${axisClasses.root}`]: {
                                            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                                                stroke: "white",
                                                strokeWidth: 2,
                                                opacity: 0.3,
                                            },
                                            [`.${axisClasses.tickLabel}`]: {
                                                fill: "white",
                                                opacity: 0.5,
                                            },
                                        },
                                        [`.${chartsAxisHighlightClasses.root}`]: {
                                            fill: "white",
                                            stroke: "white",
                                            opacity: 0.5,
                                        },
                                    }}
                                />
                            )}
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
        </>
    );
}
