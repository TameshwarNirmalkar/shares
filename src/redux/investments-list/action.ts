import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';


export const getInvestmentsCollectionAction = createAsyncThunk('GET_INVESTMENT_LIST_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/investment-list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res;
    } catch (error: any) {
        return error;
    }
});
