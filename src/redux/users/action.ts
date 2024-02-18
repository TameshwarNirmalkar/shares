import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

export const getUsersCollectionAction = createAsyncThunk('GET_USERS_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession();
        const res = await fetch(`/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.userList;
    } catch (error: any) {
        return error;
    }
});