import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';


export const getTransactionCollectionAction = createAsyncThunk('get/transactions', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/history/transaction-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.allHistory;
    } catch (error: any) {
        return error;
    }
});

export const addTransactionAction = createAsyncThunk('add/transaction', async (arg: any, { getState, dispatch }) => {
    const payload = {
        full_name: arg.full_name,
        amount: arg.profit,
        uuid: arg.uuid,
        interest_date: arg.interest_date,
        client_id: arg.client_id,
        is_paid: true,
    };
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/history/transaction-history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json());
        return res.data;
    } catch (error: any) {
        return error;
    }
})

export const onTransactionDeleteAction = createAsyncThunk('delete/transaction', async (arg: any, { getState, dispatch }) => {
    try {
        const session = await getSession() as Session;
        await fetch(`/api/history/transaction-history`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify({ _id: arg._id })
        }).then((res) => res.json());
        return arg;
    } catch (error: any) {
        return error;
    }
})
