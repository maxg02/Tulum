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
} from "../../api/apiSlice";
import { monthList } from "../Constants/Constants";
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
import { axisClasses, chartsGridClasses } from "@mui/x-charts";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { basicColors } from "../Constants/Colors";
import ValuePill from "../components/Misc/ValuePill";

export default function Budget() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);

    const clearFieldValues = () => {
        setAmount(0), setDetails(""), setDate(new Date()), setPeriodicity(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    let incomesRow: tableRow[] = [];
    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();
    let totalIncome: number = 0;
    let yearIncomes: incomeDto[] = [];
    let totalMonthIncome: number = 0;
    let totalYearIncome: number = 0;
    let dataBarChart: {
        month: string;
        income: number;
    }[] = [];

    //Income Fetching
    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();
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

        const selectedIncomeData: incomeDto = incomeData!.filter((i: incomeDto) => i.id === incomeId)[0];

        setAmount(selectedIncomeData.amount);
        setDetails(selectedIncomeData.details);
        setDate(selectedIncomeData.date);
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

        yearIncomes = incomeData.filter(
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

    const IncomeCards = () =>
        incomeData?.map((e) => (
            <button
                className="border-2 rounded-md p-2 flex gap-x-16"
                key={e.id}
                onClick={() => showDetailsIncomeModal(e.id)}
            >
                <div className="flex flex-col items-start overflow-hidden">
                    <p className="font-bold text-ellipsis overflow-hidden text-nowrap w-full text-start">
                        {e.details}
                    </p>
                    <p>{new Date(e.date).toDateString()}</p>
                </div>
                <div className="flex h-full items-center justify-end flex-1">
                    <p className="font-bold">RD${e.amount}</p>
                </div>
            </button>
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-3 overflow-x-hidden overflow-y-auto 2xl:max-h-[1000px] md:grid-cols-6 md:gap-6 2xl:flex-1 2xl:grid-rows-12">
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
                        <div className="flex justify-center relative w-full">
                            <p className="text-nowrap">Income</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateIncomeModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        {incomeData && incomeData.length === 0 ? (
                            <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full">
                                <p>Press</p>
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                                <p>to add a new income</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start flex-1 w-full max-h-[40rem] max-md:hidden lg:max-h-[30rem] 2xl:max-h-none overflow-hidden">
                                    {incomeIsLoading ? (
                                        <Loader />
                                    ) : (
                                        <Table
                                            data={incomeTableData}
                                            detailsFunction={(incomeId: number) =>
                                                showDetailsIncomeModal(incomeId)
                                            }
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col w-full overflow-x-hidden gap-4 max-h-[40rem] overflow-y-auto md:hidden">
                                    <IncomeCards />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="infoContainer2 flex-1 col-span-2 md:col-span-6 xl:col-span-3 2xl:row-span-10">
                        <p className="col-start-2 mx-auto">Income Summary {currentYear}</p>
                        <div className="flex h-96 w-full xl:h-[30rem] 2xl:h-full">
                            {incomeIsLoading ? (
                                <Loader />
                            ) : yearIncomes.length ? (
                                <BarChart
                                    dataset={dataBarChart}
                                    borderRadius={5}
                                    barLabel={(item) =>
                                        item.value ?? 0 > 1000
                                            ? `${(item.value! / 1000).toFixed(2)}K`
                                            : `${item.value}`
                                    }
                                    margin={{ left: 0 }}
                                    xAxis={[
                                        {
                                            valueFormatter: (value: number) =>
                                                value > 1000 ? `${value / 1000}K` : `${value}`,
                                        },
                                    ]}
                                    yAxis={[{ scaleType: "band", dataKey: "month", width: 35 }]}
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
                                        "& .MuiBarLabel-root": {
                                            fill: "white",
                                            fontFamily: "Karla, sans-serif",
                                        },
                                        [`.${chartsGridClasses.line}`]: {
                                            fill: "white",
                                            stroke: "white",
                                            opacity: 0.1,
                                        },
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <p className="text-gray-400">No data available for this year.</p>
                                </div>
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
        </>
    );
}
