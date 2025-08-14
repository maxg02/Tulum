export type savingGoalDto = {
    id: number;
    goal: number;
    details: string;
    goalContributions: goalContributionDto[];
};
export type createSavingGoalDto = {
    goal: number;
    details: string;
};
export type updateSavingGoalDto = {
    id: number;
    data: { goal: number; details: string; periodicity?: number; fixedContribution?: number };
};

export type goalContributionDto = {
    id: number;
    amount: number;
    date: Date;
    savingGoalId: number;
};
export type createGoalContributionDto = {
    amount: number;
    date: Date | string;
    savingGoalId: number;
};
export type updateGoalContributionDto = {
    id: number;
    data: { amount: number; date: Date | string; savingGoalId: number };
};
