export type incomeDto = { id: number; amount: number; details: string; date: Date };
export type createIncomeDto = { amount: number; details: string; date: Date | string };
export type updateIncomeDto = {
    id: number;
    data: { amount: number; details: string; date: Date | string };
};

export type dataYearBarChart = {
    month: string;
    income: number;
}[];
