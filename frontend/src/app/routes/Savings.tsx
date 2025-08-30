import SectionContent from "@//components/Layout/SectionContent";
import CustomGauge from "@//components/Graphs/CustomGauge";
import Table, { dataObject, tableRow } from "@//components/Misc/Table";
import ValuePill from "@//components/Misc/ValuePill";
import ProgressBar from "@//components/Graphs/ProgressBar";
import { useGetUserSavingGoalsQuery } from "@/features/Savings/api";
import { goalContributionDto, savingGoalDto } from "@/features/Savings/types";
import {
    CreateContribution,
    CreateGoal,
    DetailsGoal,
    DetailsContribution,
} from "@/features/Savings/Components";
import { useMemo } from "react";
import useModal from "@/Hooks/useModal";
import DataSection from "@/components/Layout/DataSection";

export type goalsProgress = {
    value: number;
    label: string;
    total: number;
    progress: number;
    id: number;
};

export default function Savings() {
    const { openCreationModal, openDetailsModal } = useModal();

    const currentMonth: number = new Date().getMonth();
    const currentYear: number = new Date().getFullYear();

    //Saving Goal Fetching
    const { data: savingGoalData, isLoading: savingGoalIsLoading } = useGetUserSavingGoalsQuery();

    const allGoalContributions = useMemo(
        () => savingGoalData?.flatMap((sG) => sG.goalContributions) ?? [],
        [savingGoalData]
    );
    allGoalContributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const goalContributionsRow: tableRow[] = useMemo(
        () =>
            allGoalContributions.map((goalContribution: goalContributionDto) => ({
                id: goalContribution.id,
                data: [
                    goalContribution.amount,
                    savingGoalData?.find((sg) => sg.id === goalContribution.savingGoalId)?.details,
                    new Date(goalContribution.date).toLocaleDateString("en-US"),
                ],
            })),
        [allGoalContributions, savingGoalData]
    );

    const savingGoalSelectValues = useMemo(
        () =>
            savingGoalData?.map((sg: savingGoalDto) => ({
                id: sg.id,
                value: sg.details,
            })) ?? [],
        [savingGoalData]
    );

    const monthSavings = useMemo(
        () =>
            allGoalContributions.filter(
                (gC) =>
                    new Date(gC.date).getMonth() === currentMonth &&
                    new Date(gC.date).getFullYear() === currentYear
            ),
        [allGoalContributions, currentMonth, currentYear]
    );

    const yearSavings = useMemo(
        () => allGoalContributions.filter((gC) => new Date(gC.date).getFullYear() === currentYear),
        [allGoalContributions, currentYear]
    );

    const totalMonthSavings = useMemo(
        () => monthSavings.reduce((acc: number, next: goalContributionDto) => acc + next.amount, 0),
        [monthSavings]
    );

    const totalYearSavings = useMemo(
        () => yearSavings.reduce((acc: number, next: goalContributionDto) => acc + next.amount, 0),
        [yearSavings]
    );

    const goalContributionsBySavings = useMemo(
        () => Object.groupBy(allGoalContributions, (gC: goalContributionDto) => gC.savingGoalId),
        [allGoalContributions]
    );

    const goalsProgressData = useMemo(
        () =>
            savingGoalData
                ?.map<goalsProgress>((sg) => {
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
                .sort((a, b) => b.value - a.value) ?? [],
        [savingGoalData, goalContributionsBySavings]
    );

    const goalsContributionsTableData: dataObject = {
        columns: [
            { name: "Amount", type: "amount" },
            { name: "Goal", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: goalContributionsRow,
    };

    const goalProgressGauges = () =>
        goalsProgressData.map((item, key) => (
            <div key={key} className="flex flex-col items-center">
                <button
                    onClick={() =>
                        openDetailsModal(
                            "savingGoal",
                            savingGoalData?.find((sg) => sg.id === item.id) ?? null
                        )
                    }
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
        goalsProgressData.map((item, key) => (
            <button
                key={key}
                className="w-full flex flex-col"
                onClick={() =>
                    openDetailsModal(
                        "savingGoal",
                        savingGoalData?.find((sg) => sg.id === item.id) ?? null
                    )
                }
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
                            <ValuePill
                                title={new Date(0, currentMonth).toLocaleString("en-US", {
                                    month: "long",
                                })}
                                value={totalMonthSavings}
                            />
                        </div>
                        <div className="flex-1">
                            <ValuePill title={currentYear.toString()} value={totalYearSavings} />
                        </div>
                    </div>
                    <hr className="border-t-2 md:hidden"></hr>
                    <div className="infoContainer1 xl:col-span-7 xl:flex-col xl:row-span-9 xl:max-2xl:order-3 2xl:row-span-11">
                        <DataSection
                            title="Savings Goals"
                            createFunction={() => openCreationModal("savingGoal")}
                            isLoading={savingGoalIsLoading}
                            isEmpty={savingGoalData?.length === 0}
                        >
                            {!savingGoalIsLoading && (
                                <>
                                    <div className="w-full flex flex-col gap-y-2 md:hidden max-md:max-h-96 max-md:overflow-y-auto">
                                        {goalProgressBars()}
                                    </div>
                                    <div className="hidden w-full md:flex overflow-y-auto gap-7 flex-wrap justify-center max-h-96 xl:max-h-none">
                                        {goalProgressGauges()}
                                    </div>
                                </>
                            )}
                        </DataSection>
                    </div>
                    <div className="infoContainer2 xl:col-span-4 xl:row-span-12 xl:max-2xl:order-2 2xl:row-span-7">
                        <DataSection
                            title="Goals Contributions"
                            createFunction={() => openCreationModal("goalContribution")}
                            isLoading={savingGoalIsLoading}
                            isEmpty={goalsContributionsTableData.rows.length === 0}
                        >
                            {!savingGoalIsLoading && (
                                <Table
                                    data={goalsContributionsTableData}
                                    detailsFunction={(gCId: number) =>
                                        openDetailsModal(
                                            "goalContribution",
                                            allGoalContributions.find((gc) => gc.id === gCId)!
                                        )
                                    }
                                    dark
                                />
                            )}
                        </DataSection>
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
