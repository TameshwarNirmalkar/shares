import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { createReInvestmentsAction, deleteReInvestmentsAction, getReInvestmentsCollectionAction, updateReInvestmentsAction } from './action';

interface ReInvestmentCollection {
    uuid: string;
    _id: number;
    interest_date: Date;
    investment_date: Date;
    initial_amount: number;
    monthly_amount: number;
    base_percentage: number;
    monthly_percentage: number;
    monthly_interest: number;
    profit: number;
}

interface InterestStateI {
    isLoading: boolean;
    errorMsg: string | null;
}

const reInvestmentsAdapter = createEntityAdapter<ReInvestmentCollection, EntityId>({
    selectId: (interest: ReInvestmentCollection) => interest._id,
});

const reInvestmentsSlice = createSlice({
    name: 'RE_INVEST_SLICE',
    initialState: reInvestmentsAdapter.getInitialState<InterestStateI>({ isLoading: false, errorMsg: '' }),
    reducers: {
        reInvestmentAdded: reInvestmentsAdapter.addOne,
        reInvestmentUpdate: reInvestmentsAdapter.updateOne,
        reInvestmentRemove: reInvestmentsAdapter.removeOne,
        reInvestmentAddMany: reInvestmentsAdapter.addMany, // for addmany and upsertmany we need the entity id (selectedId) then only data will be added in the entity.
    },
    extraReducers(builder) {
        builder.addCase(getReInvestmentsCollectionAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(getReInvestmentsCollectionAction.fulfilled, (state: any, action: PayloadAction<ReInvestmentCollection[]>) => {
            state.isLoading = false;
            reInvestmentsAdapter.upsertMany(state, action.payload);
        }).addCase(getReInvestmentsCollectionAction.rejected, (state: any, action) => {
            state.errorMsg = action.error
        }).addCase(createReInvestmentsAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(createReInvestmentsAction.fulfilled, (state: any, action: PayloadAction<ReInvestmentCollection>) => {
            state.isLoading = false;
            reInvestmentsAdapter.addOne(state, action.payload);
        }).addCase(updateReInvestmentsAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(updateReInvestmentsAction.fulfilled, (state: any, action: PayloadAction<ReInvestmentCollection>) => {
            state.isLoading = false;
            reInvestmentsAdapter.updateOne(state, { id: action.payload._id, changes: { ...action.payload } });
        }).addCase(deleteReInvestmentsAction.pending, (state: any) => {
            state.isLoading = true;
        }).addCase(deleteReInvestmentsAction.fulfilled, (state: any, action: PayloadAction<string>) => {
            state.isLoading = false;
            reInvestmentsAdapter.removeOne(state, action.payload);
        })

    }
});

export const {
    selectAll: selectAllReInvestments,
    selectById: selectReInvestmentById,
    selectIds: selectReInvestmentIds
    // Pass in a selector that returns the product slice of state
} = reInvestmentsAdapter.getSelectors((state: AppState) => state.reInvestments);

export const { reInvestmentAdded, reInvestmentUpdate, reInvestmentRemove, reInvestmentAddMany } = reInvestmentsSlice.actions;
export default reInvestmentsSlice.reducer;



