export type incomeDto = { id: number; amount: number; details: string; date: Date };
export type createIncomeDto = { amount: number; details: string; date: Date | string };
export type updateIncomeDto = {
    id: number;
    data: { amount: number; details: string; date: Date | string };
};

export type fixedIncomeDto = { id: number; amount: number; details: string; periodicity: number };
export type createFixedIncomeDto = { amount: number; details: string; periodicity: number };
export type updateFixedIncomeDto = {
    id: number;
    data: { amount: number; details: string; periodicity: number };
};

export type dataYearBarChart = {
    month: string;
    income: number;
}[];
