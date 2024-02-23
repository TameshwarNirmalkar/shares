import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { interestAdded, interestRemove, interestUpdate } from '.';


export const getInterestCollectionAction = createAsyncThunk('GET_INTEREST_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/interest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.interestList;
    } catch (error: any) {
        return error;
    }
});

export const createInterestAction = createAsyncThunk('CREATE_INTEREST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session: any = await getSession() as Session;
        const res = await fetch("/api/interest", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uuid: session.user.user.id, ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            // dispatch(interestAddMany(...arg.investments));
            dispatch(interestAdded(res.data));
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }

})

export const updateInterestAction = createAsyncThunk('UPDATE_INTEREST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch("/api/interest", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(interestUpdate({ id: arg._id, changes: { ...arg } }));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})

export const deleteInterestAction = createAsyncThunk('DELETE_INTEREST_ACTION', async (arg: any, { dispatch }) => {
    try {
        const { _id, parent_id } = arg;
        const session = await getSession() as Session;
        const res = await fetch("/api/interest", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id, parent_id }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(interestRemove(_id));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})