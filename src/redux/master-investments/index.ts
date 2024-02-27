import { createEntityAdapter, createSelector, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { getMasterInvestmentCollectionAction } from './action';

interface MasterInvestmentCollection {
    _id: string,
    uuid: string;
    full_name: string;
    amount: number;
    investment_date: string;
    interest_date: string;
    monthly_interest: number;
    daily_interest: string;
    no_of_days: number;
    base_percentage: number;
    monthly_percentage: number;
}

interface MasterInvestmentStateI {
    isLoading: boolean;
    errorMsg: string | null;
}

const masterInvestmentsAdapter = createEntityAdapter<MasterInvestmentCollection, EntityId>({
    selectId: (interest: MasterInvestmentCollection) => interest._id,
    sortComparer: (a: MasterInvestmentCollection, b: MasterInvestmentCollection) => a.full_name.localeCompare(b.full_name)
});

const masterInvestmentSlice = createSlice({
    name: 'MI_SLICE',
    initialState: masterInvestmentsAdapter.getInitialState<MasterInvestmentStateI>({ isLoading: false, errorMsg: '' }),
    reducers: {
        masterInvestmentAdded: masterInvestmentsAdapter.addOne,
        masterInvestmentUpdate: masterInvestmentsAdapter.updateOne,
        masterInvestmentRemove: masterInvestmentsAdapter.removeOne,
        masterInvestmentAddMany: masterInvestmentsAdapter.addMany, // for addmany and upsertmany we need the entity id (selectedId) then only data will be added in the entity.
    },
    extraReducers(builder) {
        builder.addCase(getMasterInvestmentCollectionAction.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        }).addCase(getMasterInvestmentCollectionAction.fulfilled, (state: any, action: PayloadAction<MasterInvestmentCollection[]>) => {
            state.isLoading = false;
            masterInvestmentsAdapter.upsertMany(state, action.payload);
        }).addCase(getMasterInvestmentCollectionAction.rejected, (state: any, action) => {
            state.errorMsg = action.error
        })
    }
});

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllMasterInvestment,
    selectById: selectMasterInvestmentById,
    selectIds: selectMasterInvestmentIds
} = masterInvestmentsAdapter.getSelectors((state: AppState) => state.masterInvestment);

export const { masterInvestmentAdded, masterInvestmentUpdate, masterInvestmentRemove, masterInvestmentAddMany } = masterInvestmentSlice.actions;
export default masterInvestmentSlice.reducer;

export const getTotalMasterInvestment = createSelector(
    [selectAllMasterInvestment],
    (allinterest) => {
        return allinterest.reduce((acc: number, ite: any) => acc + ite.amount, 0).toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
        });
    }
);
export const getTotalMasterInterest = createSelector(
    [selectAllMasterInvestment],
    (allinterest) => {
        return allinterest.reduce((acc: number, ite: any) => acc + ite.monthly_interest, 0).toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
        });
    }
);



