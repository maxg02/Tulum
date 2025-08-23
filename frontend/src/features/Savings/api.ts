import { apiSlice } from "@/api/apiSlice";
import {
    createGoalContributionDto,
    createSavingGoalDto,
    savingGoalDto,
    updateGoalContributionDto,
    updateSavingGoalDto,
} from "./types";

export const savingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Saving Goal endpoints
        getUserSavingGoals: builder.query<savingGoalDto[], void>({
            query: () => `savinggoal`,
            providesTags: ["SavingGoal"],
        }),
        createSavingGoal: builder.mutation({
            query: (savingGoalData: createSavingGoalDto) => ({
                url: "savinggoal",
                method: "POST",
                body: savingGoalData,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        updateSavingGoal: builder.mutation({
            query: (savingGoalData: updateSavingGoalDto) => ({
                url: `savinggoal/${savingGoalData.id}`,
                method: "PUT",
                body: savingGoalData.data,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        deleteSavingGoal: builder.mutation({
            query: (Id: number) => ({
                url: `savinggoal/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavingGoal"],
        }),

        //Goal Contribution endpoints
        createGoalContribution: builder.mutation({
            query: (goalContributionData: createGoalContributionDto) => ({
                url: "goalContribution",
                method: "POST",
                body: goalContributionData,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        updateGoalContribution: builder.mutation({
            query: (goalContributionData: updateGoalContributionDto) => ({
                url: `goalContribution/${goalContributionData.id}`,
                method: "PUT",
                body: goalContributionData.data,
            }),
            invalidatesTags: ["SavingGoal"],
        }),
        deleteGoalContribution: builder.mutation({
            query: (Id: number) => ({
                url: `goalContribution/${Id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavingGoal"],
        }),
    }),
});

export const {
    useGetUserSavingGoalsQuery,
    useCreateSavingGoalMutation,
    useUpdateSavingGoalMutation,
    useDeleteSavingGoalMutation,

    useCreateGoalContributionMutation,
    useUpdateGoalContributionMutation,
    useDeleteGoalContributionMutation,
} = savingsApi;
