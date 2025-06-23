import React, { useState } from "react";
import SectionContent from "../components/Layout/SectionContent";
import CustomGauge from "../components/Graphs/CustomGauge";
import Table, { dataObject, tableRow } from "../components/Misc/Table";
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
import { periodicityValues } from "../Constants/Constants";
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
import ValuePill from "../components/Misc/ValuePill";
import ProgressBar from "../components/Graphs/ProgressBar";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type goalsProgress = {
    value: number;
    label: string;
    total: number;
    progress: number;
};

export default function Savings() {
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
        }[] = [],
        allGoalContributions: goalContributionDto[] = [],
        totalMonthSavings: number = 0,
        totalYearSavings: number = 0,
        goalsProgressData: goalsProgress[] = [];

    const currentDate: Date = new Date();
    const currentMonth: string = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
    const currentYear: number = currentDate.getFullYear();

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

        const monthSavings = allGoalContributions.filter(
            (gC) =>
                new Date(gC.date).getMonth() === currentDate.getMonth() &&
                new Date(gC.date).getFullYear() === currentDate.getFullYear()
        );

        const yearSavings = allGoalContributions.filter(
            (gC) => new Date(gC.date).getFullYear() === currentDate.getFullYear()
        );

        totalMonthSavings = monthSavings.reduce(
            (acc: number, next: goalContributionDto) => acc + next.amount,
            0
        );

        totalYearSavings = yearSavings.reduce(
            (acc: number, next: goalContributionDto) => acc + next.amount,
            0
        );

        const goalContributionsBySavings: object = Object.groupBy(
            allGoalContributions,
            (gC: goalContributionDto) => gC.savingGoalId
        );

        goalsProgressData = savingGoalData
            .map((sg) => {
                const progress = goalContributionsBySavings[sg.id.toString()]
                    ? goalContributionsBySavings[sg.id.toString()].reduce(
                          (acc: number, gC: goalContributionDto) => acc + gC.amount,
                          0
                      )
                    : 0;

                return {
                    label: sg!.details,
                    id: sg!.id,
                    total: sg!.goal,
                    progress: progress,
                    value: (progress * 100) / sg!.goal,
                };
            })
            .sort((a, b) => a.value - b.value)
            .reverse();
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

    const goalsProgress = goalsProgressData;

    const goalProgressGauges = () =>
        goalsProgress.map((item, key) => (
            <div key={key} className="flex flex-col items-center">
                <button
                    onClick={() => showDetailsSavingGoalModal(item.id)}
                    className="mb-1 w-36 2xl:w-52 aspect-square"
                >
                    <CustomGauge value={item.value} label={item.label} />
                </button>
                <p>
                    RD${item.progress}/<span className="opacity-50">RD${item.total}</span>
                </p>
            </div>
        ));

    const goalProgressBars = () =>
        goalsProgress.map((item, key) => (
            <div key={key} className="w-full flex flex-col">
                <p>{item.label}</p>
                <ProgressBar value={item.value} total={item.total} />
            </div>
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-1 gap-8 overflow-x-hidden overflow-y-auto auto-rows-auto 2xl:grid-rows-11 2xl:grid-cols-11 2xl:flex-1 max-h-[1200px]">
                    <div className="flex gap-3 2xl:col-span-4 2xl:flex-col 2xl:row-span-4">
                        <div className="flex-1">
                            <ValuePill title={currentMonth} value={totalMonthSavings} />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearSavings} />
                        </div>
                    </div>
                    <hr className="border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 2xl:col-span-7 2xl:flex-col 2xl:row-span-11">
                        <div className="grid grid-cols-3 w-full">
                            <p className="col-start-2 mx-auto">Saving Goals</p>
                            <button
                                className="ml-auto tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                                onClick={showCreateSavingGoalModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="w-100 md:hidden">{goalProgressBars()}</div>
                        <div className="flex-1 w-full items-center">
                            <div className="hidden md:flex overflow-x-auto gap-7 flex-wrap justify-center">
                                {goalProgressGauges()}
                            </div>
                        </div>
                    </div>
                    <div className="infoContainer2 2xl:col-span-4 2xl:row-span-7">
                        <div className="grid grid-cols-3 w-full">
                            <p className="col-start-2 mx-auto">Goals Contributions</p>
                            <button
                                className="ml-auto tableButton flex gap-x-2 p-0 items-center 2xl:opacity-70 hover:opacity-100"
                                onClick={showCreateGoalContributionModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex flex-1 w-full">
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
                                    rowLimit={5}
                                />
                            )}
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
        </>
    );
}
