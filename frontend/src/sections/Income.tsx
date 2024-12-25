import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import Table, { tableRow } from "../components/Table";
import { dataObject } from "../components/Table";
import {
    useGetUserIncomesQuery,
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
} from "../../api/apiSlice";
import { periodicityValues } from "../components/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateModal from "../components/CreateModal";
import DetailsModal from "../components/DetailsModal";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import { AmountField, DateField, DetailsField, ListField } from "../components/ModalsFields";
import Loader from "../components/Loader";

export default function Budget() {
    const [amount, setAmount] = useState<number>(0);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number>(0);
    const [incomeToggle, setIncomeToggle] = useState<boolean>(true);

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

    //Income Fetching
    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();
    const [createIncome] = useCreateIncomeMutation();
    const [deleteIncome] = useDeleteIncomeMutation();
    const [updateIncome] = useUpdateIncomeMutation();

    //Fixed Income Fetching
    const { data: fixedIncomeData, isLoading: fixedIncomeIsLoading } = useGetFixedIncomesByUserIdQuery(1);
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
    }

    // Fixed Income data handling
    if (!fixedIncomeIsLoading && fixedIncomeData != undefined) {
        fixedIncomesRow = fixedIncomeData.map((fixedIncome: fixedIncomeDto) => ({
            id: fixedIncome.id,
            data: [fixedIncome.amount, fixedIncome.details, fixedIncome.periodicity],
        }));
        totalFixedIncome = fixedIncomeData.reduce(
            (acc: number, next: fixedIncomeDto) => acc + next.amount,
            0
        );
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
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Income" />
            <SectionContent>
                <Header currentSection="Income" />
                <div className="flex-1 flex overflow-hidden gap-x-9">
                    <div className="flex flex-col w-5/12 gap-y-9 justify-items-stretch">
                        <div className="infoContainer1 flex-1">
                            <p>Total Income</p>
                            <h1 className="font-light text-5xl my-auto">RD${totalIncome}</h1>
                        </div>
                        <div className="infoContainer1 flex-1">
                            <p>Total Fixed Income</p>
                            <h1 className="font-light text-5xl my-auto">RD${totalFixedIncome}</h1>
                        </div>
                        <div className="infoContainer1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none flex-1">
                            <p>{`${currentMonth} Income`}</p>
                            <h1 className="font-light text-5xl my-auto">RD${totalMonthIncome}</h1>
                        </div>
                        <div className="infoContainer1 bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none flex-1">
                            <p>{`${currentYear} Income`}</p>
                            <h1 className="font-light text-5xl my-auto">RD${totalYearIncome}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-9">
                        <div className="infoContainer2 flex-1">
                            <div className="grid grid-cols-3 w-full">
                                <div className="col-start-2 mx-auto flex gap-x-3">
                                    <button
                                        onClick={() => setIncomeToggle(true)}
                                        className={`bg-transparent p-0 hover:border-transparent focus:outline-none ${
                                            !incomeToggle && "opacity-40"
                                        }`}
                                        disabled={incomeToggle}
                                    >
                                        <p>Income</p>
                                    </button>
                                    <button
                                        onClick={() => setIncomeToggle(false)}
                                        className={`bg-transparent p-0 hover:border-transparent focus:outline-none ${
                                            incomeToggle && "opacity-40"
                                        }`}
                                        disabled={!incomeToggle}
                                    >
                                        <p>Fixed Income</p>
                                    </button>
                                </div>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={
                                        incomeToggle ? showCreateIncomeModal : showCreateFixedIncomeModal
                                    }
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex items-start flex-1 w-full">
                                {incomeToggle ? (
                                    incomeIsLoading ? (
                                        <Loader />
                                    ) : (
                                        <Table
                                            dark
                                            data={incomeTableData}
                                            tablePrefix="I"
                                            detailsFunction={(incomeId: number) =>
                                                showDetailsIncomeModal(incomeId)
                                            }
                                            rowLimit={18}
                                        />
                                    )
                                ) : fixedIncomeIsLoading ? (
                                    <Loader />
                                ) : (
                                    <Table
                                        data={fixedIncomeTableData}
                                        tablePrefix="FI"
                                        dark
                                        detailsFunction={(fixedIncomeId: number) =>
                                            showDetailsFixedIncomeModal(fixedIncomeId)
                                        }
                                        rowLimit={18}
                                    />
                                )}
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
        </div>
    );
}
