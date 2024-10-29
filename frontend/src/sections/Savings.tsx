import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomGauge from "../components/CustomGauge";
import Table, { dataObject, tableRow } from "../components/Table";
import {
    createSavingGoalDto,
    savingGoalDto,
    updateSavingGoalDto,
    useCreateSavingGoalMutation,
    useDeleteSavingGoalMutation,
    useGetSavingGoalsByUserIdQuery,
    useUpdateSavingGoalMutation,
} from "../../api/apiSlice";
import { periodicityValues } from "../components/Constants";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import CreateModal from "../components/CreateModal";
import { AmountField, DetailsField, ListField, SelectField } from "../components/ModalsFields";
import DetailsModal from "../components/DetailsModal";

export type goalsProgress = {
    value: number;
    label: string;
    total: number;
    progress: number;
};

export default function Savings() {
    const [goalsProgressScroll, setGoalsProgressScroll] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [amountFC, setAmountFC] = useState<number | undefined>(undefined);
    const [details, setDetails] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [periodicity, setPeriodicity] = useState<number | undefined>(undefined);
    const [selectValue, setSelectValue] = useState<number>(0);

    let savingGoalsRow: tableRow[] = [];

    const clearFieldValues = () => {
        setAmount(0),
            setAmountFC(undefined),
            setDetails(""),
            setDate(new Date()),
            setPeriodicity(undefined),
            setSelectValue(0);
    };

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    //Saving Goal Fetching
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetSavingGoalsByUserIdQuery(1);
    const [createSavingGoal] = useCreateSavingGoalMutation();
    const [deleteSavingGoal] = useDeleteSavingGoalMutation();
    const [updateSavingGoal] = useUpdateSavingGoalMutation();

    //Saving goals data handling
    if (!savingGoalIsLoading && savingGoalData != undefined) {
        savingGoalsRow = savingGoalData.map((savingGoal: savingGoalDto) => ({
            id: savingGoal.id,
            data: [
                savingGoal.details,
                savingGoal.goal,
                savingGoal.fixedContribution,
                savingGoal.periodicity,
            ],
        }));
    }

    const goalsContributionsTableData: dataObject = {
        columns: [
            { name: "Deposit", type: "amount" },
            { name: "Goal", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: [
            { id: 1, data: [3500, "Car", "06/05/22"] },
            { id: 2, data: [5000, "Transport", "06/05/22"] },
            { id: 3, data: [150000, "House", "06/05/22"] },
            { id: 4, data: [15000, "University", "06/05/22"] },
        ],
    };

    const savingGoalsTableData: dataObject = {
        columns: [
            { name: "Detail", type: "string" },
            { name: "Cost", type: "amount" },
            { name: "Fixed Contribution", type: "amount" },
            { name: "Periodicity", type: "list", values: periodicityValues },
        ],
        rows: savingGoalsRow,
    };

    // Show create Saving Goal Modal
    const showCreateSavingGoalModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.savingGoal = true;

        dispatch(showCreateModal(newState));
    };

    //Show details Saving Goal Modal
    const showDetailsSavingGoalModal = (savingGoalId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = savingGoalId;
        newState.show = { ...detailsModalState.show, savingGoal: true };

        const selectedSavingGoalData = savingGoalData!.find((sv) => sv.id === savingGoalId);

        setAmount(selectedSavingGoalData!.goal);
        setAmountFC(selectedSavingGoalData!.fixedContribution);
        setDetails(selectedSavingGoalData!.details);
        setPeriodicity(selectedSavingGoalData!.periodicity);
        dispatch(showDetailsModal(newState));
    };

    // Create Saving Goal function
    const createSavingGoalHandler = () => {
        const savingGoalData: createSavingGoalDto = {
            goal: amount,
            details: details,
            periodicity: periodicity,
            fixedContribution: amountFC,
        };

        createSavingGoal(savingGoalData);
    };

    // Delete Saving Goal Function
    const deleteSavingGoalHandler = () => {
        const SavingGoalId = detailsModalState.id;
        deleteSavingGoal(SavingGoalId!);
    };

    // Update Saving Goal Function
    const updateSavingGoalHandler = () => {
        const savingGoalData: updateSavingGoalDto = {
            id: detailsModalState.id!,
            data: {
                goal: amount,
                details: details,
                fixedContribution: amountFC,
                periodicity: periodicity,
            },
        };

        updateSavingGoal(savingGoalData);
    };

    const goalsProgress: goalsProgress[] = [
        { value: 86, label: "House", total: 3000000, progress: 2580000 },
        { value: 25, label: "Car", total: 1500000, progress: 375000 },
        { value: 40, label: "University", total: 50000, progress: 20000 },
        { value: 60, label: "Weeding", total: 50000, progress: 30000 },
        { value: 60, label: "Luhanny", total: 50000, progress: 30000 },
    ];

    const goalProgressGauges = () =>
        goalsProgress.map((item, key) => (
            <div
                key={key}
                className="w-full flex flex-col items-center py-4"
                style={{ height: `${100 / goalsProgress.length}%` }}
            >
                <div className="flex-1 w-full mb-1">
                    <CustomGauge value={item.value} label={item.label} />
                </div>
                <p>
                    <span className="text-custom-accent">RD${item.total}</span>/RD${item.progress}
                </p>
            </div>
        ));

    const goalProgressScrollUp = () => setGoalsProgressScroll(goalsProgressScroll + 1);
    const goalProgressScrollDown = () => setGoalsProgressScroll(goalsProgressScroll - 1);

    return (
        <div className="flex flex-1 gap-8">
            <Sidebar currentSection="Savings" />
            <SectionContent>
                <Header currentSection="Savings" />
                <div className="flex-1 flex overflow-hidden gap-x-8">
                    <div className="infoContainer1 w-64">
                        <p>Goals Progress</p>
                        <div className="flex-1 w-full flex flex-col gap-y-4 justify-between overflow-y-hidden">
                            <button
                                className={`bg-transparent border-0 p-0 outline-0 ${
                                    goalsProgressScroll <= 0
                                        ? "hover:text-gray-400 text-gray-400"
                                        : "hover:text-custom-accent"
                                }`}
                                onClick={goalProgressScrollDown}
                                disabled={goalsProgressScroll <= 0 ? true : false}
                            >
                                <FontAwesomeIcon icon={faChevronUp} className="flex-none py-1" />
                            </button>
                            <div className="flex-1 overflow-y-hidden relative">
                                <div className="bg-gradient-to-b from-custom-ly1 to-transparent w-full h-4 absolute top-0 z-30"></div>
                                <div
                                    className="w-full overflow-y-hidden relative"
                                    id="goalsCarrousell"
                                    style={{
                                        height: `${33.333333333 * goalsProgress.length}%`,
                                        top: `${-33 * goalsProgressScroll}%`,
                                    }}
                                >
                                    {goalProgressGauges()}
                                </div>
                                <div className="bg-gradient-to-t from-custom-ly1 to-transparent w-full h-4 absolute bottom-0 z-30"></div>
                            </div>
                            <button
                                className={`bg-transparent border-0 p-0 outline-0 ${
                                    goalsProgressScroll >= goalsProgress.length - 3
                                        ? "hover:text-gray-400 text-gray-400"
                                        : "hover:text-custom-accent"
                                }`}
                                onClick={goalProgressScrollUp}
                                disabled={goalsProgressScroll >= goalsProgress.length - 3 ? true : false}
                            >
                                <FontAwesomeIcon icon={faChevronDown} className="flex-none py-1" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-y-8">
                        <div className="flex flex-1 gap-x-8">
                            <div className="flex-auto flex flex-col justify-between">
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>January Savings</p>
                                    <h1 className="font-light text-5xl my-auto">RD$75000</h1>
                                </div>
                                <div className="infoContainer1 w-full bg-gradient-to-b from-custom-secondary to-custom-accent shadow-none h-[45%]">
                                    <p>2024 Savings</p>
                                    <h1 className="font-light text-5xl my-auto">RD$750K</h1>
                                </div>
                            </div>
                            <div className="infoContainer2 flex-auto basis-3/5">
                                <p>Goals Contributions</p>
                                <div className="flex flex-1 items-center w-full">
                                    <Table data={goalsContributionsTableData} tablePrefix="GC" dark />
                                </div>
                            </div>
                        </div>
                        <div className="infoContainer2 flex-1">
                            <div className="grid grid-cols-3 w-full">
                                <p className="col-start-2 mx-auto">Saving Goals</p>
                                <button
                                    className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                    onClick={showCreateSavingGoalModal}
                                >
                                    <p>New</p>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="flex flex-1 items-center w-full">
                                {savingGoalIsLoading ? (
                                    <Loader />
                                ) : (
                                    <Table
                                        data={savingGoalsTableData}
                                        tablePrefix="SG"
                                        detailsFunction={(sVId: number) =>
                                            showDetailsSavingGoalModal(sVId)
                                        }
                                        dark
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
            <CreateModal show={createModalState.savingGoal} createFunction={createSavingGoalHandler}>
                <DetailsField fieldStateHandler={setDetails} />
                <AmountField fieldStateHandler={setAmount} />
                <AmountField fieldStateHandler={setAmountFC} customLabel="Fixed Contribution" />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={savingGoalsTableData.columns[3].values!}
                />
            </CreateModal>
            <DetailsModal
                updateFunction={updateSavingGoalHandler}
                deleteFunction={deleteSavingGoalHandler}
                show={detailsModalState.show.savingGoal}
            >
                <DetailsField defaultValue={details} fieldStateHandler={setDetails} />
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <AmountField
                    defaultValue={amountFC}
                    customLabel="Fixed Contribution"
                    fieldStateHandler={setAmountFC}
                />
                <ListField
                    fieldStateHandler={setPeriodicity}
                    label="Periodicity"
                    values={savingGoalsTableData.columns[3].values!}
                    defaultValue={periodicity}
                />
            </DetailsModal>
        </div>
    );
}
