import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { masterInvestmentAdded, masterInvestmentRemove, masterInvestmentUpdate } from '.';


export const getMasterInvestmentCollectionAction = createAsyncThunk('GET_MASTER_INVESTMENT_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/master-investments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.masterList;
    } catch (error: any) {
        return error;
    }
});

export const createMasterInvestmentAction = createAsyncThunk('CREATE_MASTER_INVESTMENT_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session: any = await getSession() as Session;
        const res = await fetch("/api/master-investments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            dispatch(masterInvestmentAdded(res.data));
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }

})
export const updateMasterInvestmentAction = createAsyncThunk('UPDATE_MASTER_INVESTMENT_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session: any = await getSession() as Session;
        const res = await fetch("/api/master-investments", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            dispatch(masterInvestmentUpdate({ id: arg._id, changes: { ...arg } }));
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }

})

export const deleteMasterInvestmentAction = createAsyncThunk('DELETE_MASTER_INVESTMENT_ACTION', async (arg: any, { dispatch }) => {
    try {
        const { _id, parent_id } = arg;
        const session = await getSession() as Session;
        const res = await fetch("/api/master-investments", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id, parent_id }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(masterInvestmentRemove(_id));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})