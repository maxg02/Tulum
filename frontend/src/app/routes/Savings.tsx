import SectionContent from "@//components/Layout/SectionContent";
import CustomGauge from "@//components/Graphs/CustomGauge";
import Table, { dataObject, tableRow } from "@//components/Misc/Table";
import Loader from "@//components/Misc/Loader";
import { useAppDispatch, useAppSelector } from "@//Hooks/stateHooks";
import { showModal as showCreateModal } from "@//reducers/createModalReducers";
import { showModal as showDetailsModal } from "@//reducers/detailsModalReducers";
import ValuePill from "@//components/Misc/ValuePill";
import ProgressBar from "@//components/Graphs/ProgressBar";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useGetUserSavingGoalsQuery } from "@/features/Savings/api";
import { goalContributionDto, savingGoalDto } from "@/features/Savings/types";
import {
    CreateContribution,
    CreateGoal,
    DetailsGoal,
    DetailsContribution,
} from "@/features/Savings/Components";

export type goalsProgress = {
    value: number;
    label: string;
    total: number;
    progress: number;
    id: number;
};

export default function Savings() {
    let goalContributionsRow: tableRow[] = [],
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

    const dispatch = useAppDispatch();
    const createModalState = useAppSelector((state) => state.createModal.show);
    const detailsModalState = useAppSelector((state) => state.detailsModal);

    //Saving Goal Fetching
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetUserSavingGoalsQuery();

    //Saving goals data handling
    if (!savingGoalIsLoading && savingGoalData != undefined && savingGoalData.length > 0) {
        allGoalContributions = savingGoalData?.flatMap((sG) => sG.goalContributions);
        allGoalContributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

        const goalContributionsBySavings = Object.groupBy(
            allGoalContributions,
            (gC: goalContributionDto) => gC.savingGoalId
        );

        goalsProgressData = savingGoalData
            .map<goalsProgress>((sg) => {
                const progress = goalContributionsBySavings[
                    sg.id as keyof typeof goalContributionsBySavings
                ]
                    ? goalContributionsBySavings[
                          sg.id as keyof typeof goalContributionsBySavings
                      ]!.reduce((acc: number, gC: goalContributionDto) => acc + gC.amount, 0)
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

    // Show create Saving Goal Modal
    const showCreateSavingGoalModal = () => {
        const newState = { ...createModalState };
        newState.savingGoal = true;

        dispatch(showCreateModal(newState));
    };

    // Show create Goal Contribution Modal
    const showCreateGoalContributionModal = () => {
        const newState = { ...createModalState };
        newState.goalContribution = true;

        dispatch(showCreateModal(newState));
    };

    //Show details Saving Goal Modal
    const showDetailsSavingGoalModal = (savingGoalId: number) => {
        const selectedSavingGoalData = savingGoalData!.find((sv) => sv.id === savingGoalId);

        const newState = { ...detailsModalState };
        newState.show = { ...detailsModalState.show, savingGoal: true };
        newState.data = selectedSavingGoalData;

        dispatch(showDetailsModal(newState));
    };

    //Show details Goal Contribution Modal
    const showDetailsGoalContributionModal = (goalContributionId: number) => {
        const selectedGoalContributionData = allGoalContributions!.find(
            (gc) => gc.id === goalContributionId
        );

        const newState = { ...detailsModalState };
        newState.show = { ...detailsModalState.show, goalContribution: true };
        newState.data = selectedGoalContributionData;
        dispatch(showDetailsModal(newState));
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
            <button
                key={key}
                className="w-full flex flex-col"
                onClick={() => showDetailsSavingGoalModal(item.id)}
            >
                <p>{item.label}</p>
                <ProgressBar value={item.progress} total={item.total} />
            </button>
        ));

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-1 gap-8 overflow-x-hidden overflow-y-auto auto-rows-auto xl:max-2xl:gap-5 xl:max-2xl:grid-rows-12 xl:flex-1 xl:max-h-[1000px] xl:grid-cols-11 2xl:grid-rows-11">
                    <div className="flex gap-3 overflow-hidden xl:col-span-7 xl:row-span-3 2xl:row-span-4 2xl:flex-col 2xl:col-span-4">
                        <div className="flex-1">
                            <ValuePill title={currentMonth} value={totalMonthSavings} />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearSavings} />
                        </div>
                    </div>
                    <hr className="border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 xl:col-span-7 xl:flex-col xl:row-span-9 xl:max-2xl:order-3 2xl:row-span-11">
                        <div className="flex justify-center w-full relative">
                            <p className="text-nowrap">Saving Goals</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateSavingGoalModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex flex-1 w-full max-h-[40rem] lg:max-h-96 xl:max-h-none overflow-hidden">
                            {savingGoalIsLoading ? (
                                <Loader />
                            ) : savingGoalData && savingGoalData.length ? (
                                <>
                                    <div className="w-full flex flex-col gap-y-2 md:hidden max-md:max-h-96 max-md:overflow-y-auto">
                                        {goalProgressBars()}
                                    </div>
                                    <div className="hidden w-full md:flex overflow-y-auto gap-7 flex-wrap justify-center max-h-96 xl:max-h-none">
                                        {goalProgressGauges()}
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
                                    <p>to add a new goal</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="infoContainer2 xl:col-span-4 xl:row-span-12 xl:max-2xl:order-2 2xl:row-span-7">
                        <div className="flex justify-center w-full relative">
                            <p className="text-nowrap">Goals Contributions</p>
                            <button
                                className="absolute right-0 top-0 tableButton flex gap-x-2 p-0 items-center xl:opacity-70 hover:opacity-100"
                                onClick={showCreateGoalContributionModal}
                            >
                                <HugeiconsIcon
                                    icon={AddSquareIcon}
                                    size={20}
                                    className="text-custom-accent"
                                />
                            </button>
                        </div>
                        <div className="flex flex-1 w-full max-h-[40rem] lg:max-h-96 xl:max-h-none overflow-hidden">
                            {savingGoalIsLoading ? (
                                <Loader />
                            ) : savingGoalData && goalsContributionsTableData.rows.length ? (
                                <Table
                                    data={goalsContributionsTableData}
                                    detailsFunction={(gCId: number) =>
                                        showDetailsGoalContributionModal(gCId)
                                    }
                                    dark
                                />
                            ) : (
                                <div className="text-gray-400 py-12 flex items-center gap-x-1 h-full w-full justify-center">
                                    <p>Press</p>
                                    <HugeiconsIcon
                                        icon={AddSquareIcon}
                                        size={20}
                                        className="text-custom-accent"
                                    />
                                    <p>to add a new contribution</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SectionContent>
            {/* // Create Saving Goal Modal */}
            <CreateGoal />
            {/* // Saving Goal Details Modal */}
            <DetailsGoal />
            {/* // Create Goal Contribution Modal */}
            <CreateContribution goals={savingGoalSelectValues} />
            {/* // Goal Contribution Details Modal */}
            <DetailsContribution goals={savingGoalSelectValues} />
        </>
    );
}
