import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { getUsersCollectionAction } from './action';

interface UserCollection {
    uuid: string;
    _id: number;
    profile: string;
    full_name: string;
    email: string;
    address: string;
    whatsapp: string;
    phone: string;
}

interface UserStateI {
    userList: UserCollection[];
    isLoading: boolean;
    errorMsg: string | null;
}

const usersAdapter = createEntityAdapter<UserCollection, EntityId>({
    selectId: (user: UserCollection) => user._id,
    sortComparer: (a: UserCollection, b: UserCollection) => a.full_name.localeCompare(b.full_name)
});

const userSlice = createSlice({
    name: 'USER_SLICE',
    initialState: usersAdapter.getInitialState<UserStateI>({ userList: [], isLoading: false, errorMsg: '' }),
    reducers: {
        userAdded: usersAdapter.addOne,
        userUpdate: usersAdapter.updateOne,
        userRemove: usersAdapter.removeOne,
    },
    extraReducers(builder) {
        builder.addCase(getUsersCollectionAction.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        }).addCase(getUsersCollectionAction.fulfilled, (state: any, action: PayloadAction<UserCollection[]>) => {
            state.isLoading = false;
            usersAdapter.upsertMany(state, action.payload);
        }).addCase(getUsersCollectionAction.rejected, (state: any, action) => {
            state.errorMsg = action.error
        })
    }
});

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the product slice of state
} = usersAdapter.getSelectors((state: AppState) => state.users);

export const { userAdded, userUpdate, userRemove } = userSlice.actions;
export default userSlice.reducer;

