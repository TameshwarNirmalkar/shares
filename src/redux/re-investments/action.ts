import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';


export const getReInvestmentsCollectionAction = createAsyncThunk('GET_RE_INVEST_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/re-investments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.reInvestments;
    } catch (error: any) {
        return error;
    }
});

export const createReInvestmentsAction = createAsyncThunk('CREATE_RE_INVEST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session: any = await getSession() as Session;
        const res = await fetch("/api/re-investments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return res.data;
    } catch (error) {
        return error;
    }

})

export const updateReInvestmentsAction = createAsyncThunk('UPDATE_RE_INVEST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch("/api/re-investments", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return arg;
    } catch (error) {
        return error;
    }
})

export const deleteReInvestmentsAction = createAsyncThunk('DELETE_REINVEST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const { _id } = arg;
        const session = await getSession() as Session;
        const res = await fetch("/api/re-investments", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return _id;
    } catch (error) {
        return error;
    }
})