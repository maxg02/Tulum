import SectionContent from "@/components/Layout/SectionContent";
import Table, { tableRow } from "@/components/Misc/Table";
import { dataObject } from "@/components/Misc/Table";
import { monthList } from "@/Constants/Constants";
import ValuePill from "@/components/Misc/ValuePill";
import { useGetUserIncomesQuery } from "@/features/Income/api";
import { dataYearBarChart, incomeDto } from "@/features/Income/types";
import { CreateIncome, DetailsIncome, IncomeCard, YearBarChart } from "@/features/Income/Components";
import useModal from "@/Hooks/useModal";
import DataSection from "@/components/Layout/DataSection";
import { useMemo } from "react";

export default function Budget() {
    const { openCreationModal, openDetailsModal } = useModal();

    const currentMonth: number = new Date().getMonth();
    const currentYear: number = new Date().getFullYear();

    //Income Fetching
    const { data: incomeData, isLoading: incomeIsLoading } = useGetUserIncomesQuery();

    const incomesRow: tableRow[] = useMemo(
        () =>
            incomeData?.map((income: incomeDto) => ({
                id: income.id,
                data: [income.amount, income.details, new Date(income.date).toLocaleDateString("en-US")],
            })) ?? [],
        [incomeData]
    );

    const totalIncome = useMemo(
        () => incomeData?.reduce((acc: number, next: incomeDto) => acc + next.amount, 0) ?? 0,
        [incomeData]
    );

    const monthIncomes = useMemo(() => {
        return (
            incomeData?.filter(
                (income) =>
                    new Date(income.date).getMonth() === currentMonth &&
                    new Date(income.date).getFullYear() === currentYear
            ) ?? []
        );
    }, [incomeData, currentMonth, currentYear]);

    const yearIncomes = useMemo(
        () => incomeData?.filter((income) => new Date(income.date).getFullYear() === currentYear) ?? [],
        [incomeData, currentYear]
    );

    const totalMonthIncome = useMemo(
        () => monthIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
        [monthIncomes]
    );
    const totalYearIncome = useMemo(
        () => yearIncomes.reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
        [yearIncomes]
    );

    const dataBarChart: dataYearBarChart = useMemo(
        () =>
            monthList.map((month) => ({
                month,
                income: yearIncomes
                    .filter(
                        (income: incomeDto) =>
                            new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                                new Date(income.date)
                            ) == month
                    )
                    .reduce((acc: number, next: incomeDto) => acc + next.amount, 0),
            })),
        [yearIncomes]
    );

    //Income table structure
    const incomeTableData: dataObject = {
        columns: [
            { name: "Income", type: "amount" },
            { name: "Details", type: "string" },
            { name: "Date", type: "date" },
        ],
        rows: incomesRow,
    };

    const IncomeCards = () => incomeData?.map((income, key) => <IncomeCard key={key} income={income} />);

    return (
        <>
            <SectionContent>
                <div className="grid grid-cols-2 auto-rows-auto gap-3 overflow-x-hidden overflow-y-auto md:grid-cols-6 md:gap-6 xl:gap-5 xl:grid-rows-12 xl:flex-1 2xl:gap-8 2xl:max-h-[1000px]">
                    <div className="flex-1 md:col-span-2 xl:row-span-3 2xl:row-span-2">
                        <ValuePill
                            title={new Date(0, currentMonth).toLocaleString("en-US", {
                                month: "long",
                            })}
                            value={totalMonthIncome}
                        />
                    </div>
                    <div className="flex-1 md:col-span-2 xl:row-span-3 2xl:row-span-2">
                        <ValuePill title={currentYear.toString()} value={totalYearIncome} />
                    </div>
                    <div className="flex-1 col-span-2 xl:row-span-3 2xl:row-span-2">
                        <ValuePill title="Total" value={totalIncome} />
                    </div>

                    <hr className="col-span-2 my-4 border-t-2 md:hidden"></hr>

                    <div className="infoContainer1 flex-1 col-span-2 mb-6 md:col-span-6 md:mb-0 xl:col-span-3 xl:row-span-9 2xl:row-span-10">
                        <DataSection
                            isLoading={incomeIsLoading}
                            title="Income"
                            isEmpty={incomeData?.length === 0}
                            createFunction={() => openCreationModal("income")}
                        >
                            {!incomeIsLoading && (
                                <>
                                    <div className="flex items-start flex-1 w-full max-h-[40rem] max-md:hidden lg:max-h-[30rem] xl:max-h-none overflow-hidden">
                                        <Table
                                            data={incomeTableData}
                                            detailsFunction={(incomeId: number) => {
                                                const income =
                                                    incomeData?.find((i) => i.id === incomeId) ?? null;
                                                openDetailsModal("income", income);
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full overflow-x-hidden gap-4 max-h-[40rem] overflow-y-auto md:hidden">
                                        <IncomeCards />
                                    </div>
                                </>
                            )}
                        </DataSection>
                    </div>

                    <div className="infoContainer2 flex-1 col-span-2 md:col-span-6 xl:col-span-3 xl:row-span-9 2xl:row-span-10">
                        <DataSection
                            isLoading={incomeIsLoading}
                            title={`Income Summary ${currentYear}`}
                            isEmpty={yearIncomes.length === 0}
                            customEmptyMsg="No data available for this year"
                        >
                            <div className="flex h-96 w-full xl:h-full">
                                <YearBarChart dataBarChart={dataBarChart} />
                            </div>
                        </DataSection>
                    </div>
                </div>
            </SectionContent>
            {/* Create Income Modal */}
            <CreateIncome />
            {/* Details Income Modal */}
            <DetailsIncome />
        </>
    );
}
