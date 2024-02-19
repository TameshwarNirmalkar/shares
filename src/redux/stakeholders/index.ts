import { AppState } from "@redux-store/store";
import { EntityId, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createProductCollectionAction } from './action';

interface StakeholderCollectionI {
    email: string;
    full_name: string;
    _id: number;
    interest_date: string;
    percentage: number;
    phone: number;
    principle_amount: number;
    uuid: string;
}

interface StakeholderStateI {
    isLoading: boolean;
}

const stakeholdersAdapter = createEntityAdapter<StakeholderCollectionI, EntityId>({
    selectId: (stake: StakeholderCollectionI) => stake._id,
    sortComparer: (a: StakeholderCollectionI, b: StakeholderCollectionI) => a.full_name.localeCompare(b.full_name)
});

const stakeholderSlice = createSlice({
    name: 'STAKEHOLDER_SLICE',
    initialState: stakeholdersAdapter.getInitialState<StakeholderStateI>({ isLoading: false }),
    reducers: {
        stakeholdersAddOne: stakeholdersAdapter.addOne,
        stakeholdersUpdateOne: stakeholdersAdapter.updateOne,
        stakeholdersRemoveOne: stakeholdersAdapter.removeOne,
    },
    extraReducers(builder) {
        builder
            .addCase(createProductCollectionAction.pending, (state) => {
                state.isLoading = true;
            }).addCase(createProductCollectionAction.fulfilled, (state: any, action) => {
                state.isLoading = false;
                stakeholdersAdapter.upsertMany(state, action.payload);
            });
    }
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStakeholders,
    selectById: selectStakeholderById,
    selectIds: selectStakeholderIds
    // Pass in a selector that returns the product slice of state
} = stakeholdersAdapter.getSelectors((state: AppState) => state.stakeholders);

export const { stakeholdersAddOne, stakeholdersUpdateOne, stakeholdersRemoveOne } = stakeholderSlice.actions;
export default stakeholderSlice.reducer;

