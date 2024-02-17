import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    accessToken: string | null;
    userList: UserCollection[];
    isLoading: boolean;
}

const usersAdapter = createEntityAdapter({
    selectId: (user: UserCollection) => user._id,
    sortComparer: (a: any, b: any) => a.full_name.localeCompare(b.full_name)
});

const userSlice = createSlice({
    name: 'USER_SLICE',
    initialState: usersAdapter.getInitialState({ accessToken: null, userList: [], isLoading: false }),
    reducers: {
        setAccessToken(state: UserStateI, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getUsersCollectionAction.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        }).addCase(getUsersCollectionAction.fulfilled, (state: any, action: PayloadAction<UserCollection[]>) => {
            state.isLoading = false;
            state.userList = action.payload;
            usersAdapter.upsertMany(state, action.payload);
        })
    }
}) as any;

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the product slice of state
} = usersAdapter.getSelectors((state: AppState) => state.users);

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;

