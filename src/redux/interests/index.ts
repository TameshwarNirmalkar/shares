import { createEntityAdapter, createSelector, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { getInterestCollectionAction } from './action';

interface InterestCollection {
    uuid: string;
    _id: number;
    amount: number;
    calculated_amount: number;
    interest_date: Date;
    investment_date: Date;
    investment_name: string;
    percentage: number;
}

interface InterestStateI {
    isLoading: boolean;
    errorMsg: string | null;
}

const interestsAdapter = createEntityAdapter<InterestCollection, EntityId>({
    selectId: (interest: InterestCollection) => interest._id,
    sortComparer: (a: InterestCollection, b: InterestCollection) => a.investment_name.localeCompare(b.investment_name)
});

const interestSlice = createSlice({
    name: 'INTEREST_SLICE',
    initialState: interestsAdapter.getInitialState<InterestStateI>({ isLoading: false, errorMsg: '' }),
    reducers: {
        interestAdded: interestsAdapter.addOne,
        interestUpdate: interestsAdapter.updateOne,
        interestRemove: interestsAdapter.removeOne,
        interestAddMany: interestsAdapter.addMany, // for addmany and upsertmany we need the entity id (selectedId) then only data will be added in the entity.
    },
    extraReducers(builder) {
        builder.addCase(getInterestCollectionAction.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        }).addCase(getInterestCollectionAction.fulfilled, (state: any, action: PayloadAction<InterestCollection[]>) => {
            state.isLoading = false;
            interestsAdapter.upsertMany(state, action.payload);
        }).addCase(getInterestCollectionAction.rejected, (state: any, action) => {
            state.errorMsg = action.error
        })
    }
});

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllInterests,
    selectById: selectInterestById,
    selectIds: selectInterestIds
    // Pass in a selector that returns the product slice of state
} = interestsAdapter.getSelectors((state: AppState) => state.interests);

export const { interestAdded, interestUpdate, interestRemove, interestAddMany } = interestSlice.actions;
export default interestSlice.reducer;

// export const getTotalPrinciple = (state: AppState) => state.interests.isLoading;
export const getTotalPrinciple = createSelector(
    [selectAllInterests],
    (allinterest) => {
        return allinterest.reduce((acc: number, ite: any) => acc + ite.amount, 0).toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
        });
    }
);
export const getTotalInterest = createSelector(
    [selectAllInterests],
    (allinterest) => {
        return allinterest.reduce((acc: number, ite: any) => acc + ite.calculated_amount, 0).toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
        });
    }
);

