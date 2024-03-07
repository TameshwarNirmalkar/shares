import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';


export const getTransactionCollectionAction = createAsyncThunk('GET_TRANSCATION_HISTORY_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/history/transaction-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return {
            transaction_history: res.allHistory, payment_history: []
        };
    } catch (error: any) {
        return error;
    }
});

export const addTransactionAction = createAsyncThunk('add/transaction', async (arg: any, { getState, dispatch }) => {
    const payload = {
        amount: arg.profit,
        uuid: arg.uuid,
        _id: arg._id,
        investment_date: arg.interest_date,
    };
    return payload;
})
