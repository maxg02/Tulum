import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SectionContent from "../components/SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomGauge from "../components/CustomGauge";
import Table, { dataObject, tableRow } from "../components/Table";
import {
    createGoalContributionDto,
    createSavingGoalDto,
    goalContributionDto,
    savingGoalDto,
    updateGoalContributionDto,
    updateSavingGoalDto,
    useCreateGoalContributionMutation,
    useCreateSavingGoalMutation,
    useDeleteGoalContributionMutation,
    useDeleteSavingGoalMutation,
    useGetSavingGoalsByUserIdQuery,
    useUpdateGoalContributionMutation,
    useUpdateSavingGoalMutation,
} from "../../api/apiSlice";
import { periodicityValues } from "../components/Constants";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks";
import { showModal as showCreateModal } from "../reducers/createModalReducers";
import { showModal as showDetailsModal } from "../reducers/detailsModalReducers";
import CreateModal from "../components/CreateModal";
import { AmountField, DateField, DetailsField, ListField, SelectField } from "../components/ModalsFields";
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

    let savingGoalsRow: tableRow[] = [],
        goalContributionsRow: tableRow[] = [],
        savingGoalSelectValues: {
            id: number;
            value: string;
        }[] = [];
    let allGoalContributions: goalContributionDto[] = [];

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

    //Goal Contribution Fetching
    const [createGoalContribution] = useCreateGoalContributionMutation();
    const [deleteGoalContribution] = useDeleteGoalContributionMutation();
    const [updateGoalContribution] = useUpdateGoalContributionMutation();

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

        allGoalContributions = savingGoalData
            ?.map((sG) => sG.goalContributions)
            .reduce((acc, currentValue) => acc!.concat(currentValue!), []);

        goalContributionsRow = allGoalContributions.map((goalContribution: goalContributionDto) => ({
            id: goalContribution.id,
            data: [
                goalContribution.amount,
                savingGoalData.find((sg) => sg.id === goalContribution.savingGoalId)?.details,
                new Date(goalContribution.date).toLocaleDateString("en-US"),
            ],
        }));

        savingGoalSelectValues = savingGoalData.map((sg: savingGoalDto) => ({
            id: sg.id,
            value: sg.details,
        }));
    }

    const goalsContributionsTableData: dataObject = {
        columns: [
            { name: "Amount", type: "amount" },
            { name: "Goal", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: goalContributionsRow,
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

    // Show create Goal Contribution Modal
    const showCreateGoalContributionModal = () => {
        clearFieldValues();
        const newState = { ...createModalState };
        newState.goalContribution = true;

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

    //Show details Goal Contribution Modal
    const showDetailsGoalContributionModal = (goalContributionId: number) => {
        clearFieldValues();
        const newState = { ...detailsModalState };
        newState.id = goalContributionId;
        newState.show = { ...detailsModalState.show, goalContribution: true };

        const selectedGoalContributionData = allGoalContributions!.find(
            (gc) => gc.id === goalContributionId
        );

        setAmount(selectedGoalContributionData!.amount);
        setSelectValue(
            savingGoalData!.find((sg) => sg.id === selectedGoalContributionData!.savingGoalId)!.id
        );
        setDate(selectedGoalContributionData!.date);

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

    // Create Goal Contribution function
    const createGoalContributionHandler = () => {
        const goalContributionData: createGoalContributionDto = {
            amount: amount,
            date: date,
            savingGoalId: selectValue,
        };

        createGoalContribution(goalContributionData);
    };

    // Delete Saving Goal Function
    const deleteSavingGoalHandler = () => {
        const savingGoalId = detailsModalState.id;
        deleteSavingGoal(savingGoalId!);
    };

    // Delete Goal Contribution Function
    const deleteGoalContributionHandler = () => {
        const goalContributionId = detailsModalState.id;
        deleteGoalContribution(goalContributionId!);
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

    // Update Goal Contribution Function
    const updateGoalContributionHandler = () => {
        const goalContributionData: updateGoalContributionDto = {
            id: detailsModalState.id!,
            data: {
                amount: amount,
                date: date,
                savingGoalId: selectValue,
            },
        };

        updateGoalContribution(goalContributionData);
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
                                <div className="grid grid-cols-3 w-full">
                                    <p className="col-start-2 mx-auto">Goals Contributions</p>
                                    <button
                                        className="ml-auto tableButton flex gap-x-2 p-0 items-center opacity-55 hover:opacity-100"
                                        onClick={showCreateGoalContributionModal}
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
                                            data={goalsContributionsTableData}
                                            tablePrefix="GC"
                                            detailsFunction={(gCId: number) =>
                                                showDetailsGoalContributionModal(gCId)
                                            }
                                            dark
                                        />
                                    )}
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
            <CreateModal
                show={createModalState.goalContribution}
                createFunction={createGoalContributionHandler}
            >
                <AmountField fieldStateHandler={setAmount} />
                <SelectField
                    fieldStateHandler={setSelectValue}
                    label="Goal"
                    values={savingGoalSelectValues}
                />
                <DateField defaultValue={date} fieldStateHandler={setDate} />
            </CreateModal>
            <DetailsModal
                updateFunction={updateGoalContributionHandler}
                deleteFunction={deleteGoalContributionHandler}
                show={detailsModalState.show.goalContribution}
            >
                <AmountField defaultValue={amount} fieldStateHandler={setAmount} />
                <SelectField
                    defaultValue={selectValue}
                    fieldStateHandler={setSelectValue}
                    label="Goal"
                    values={savingGoalSelectValues!}
                />
                <DateField defaultValue={date} fieldStateHandler={setDate} />
            </DetailsModal>
        </div>
    );
}
