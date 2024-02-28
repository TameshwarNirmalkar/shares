import { AppState } from "@redux-store/store";
import { EntityId, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getMyClientsListAction } from './action';

interface MyClientsCollectionI {
    uuid: string;
    _id: number;
    full_name: string;
    phone: number;
    profile_image: string;
    email?: string;
    interest_date?: string;
    percentage?: number;
    principle_amount?: number;
}

interface MyClientstateI {
    isLoading: boolean;
    errorMsg: string;
}

const myClientsAdapter = createEntityAdapter<MyClientsCollectionI, EntityId>({
    selectId: (client: MyClientsCollectionI) => client._id,
    sortComparer: (a: MyClientsCollectionI, b: MyClientsCollectionI) => a.full_name.localeCompare(b.full_name)
});

const myClientSlice = createSlice({
    name: 'MYCL_SLICE',
    initialState: myClientsAdapter.getInitialState<MyClientstateI>({ isLoading: false, errorMsg: '' }),
    reducers: {
        myClientsAddOne: myClientsAdapter.addOne,
        myClientsUpdateOne: myClientsAdapter.updateOne,
        myClientsRemoveOne: myClientsAdapter.removeOne,
    },
    extraReducers(builder) {
        builder
            .addCase(getMyClientsListAction.pending, (state: MyClientstateI) => {
                state.isLoading = true;
            }).addCase(getMyClientsListAction.fulfilled, (state: any, action) => {
                state.isLoading = false;
                myClientsAdapter.upsertMany(state, action.payload);
            });
    }
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllMyClients,
    selectById: selectMyClientsById,
    selectIds: selectMyClientsIds
    // Pass in a selector that returns the product slice of state
} = myClientsAdapter.getSelectors((state: AppState) => state.myClientList);

export const { myClientsAddOne, myClientsUpdateOne, myClientsRemoveOne } = myClientSlice.actions;
export default myClientSlice.reducer;



