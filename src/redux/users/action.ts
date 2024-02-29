import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { userUpdate } from '.';


export const getUsersCollectionAction = createAsyncThunk('GET_USERS_COLLECTION', async (arg: any, { getState }) => {
    try {
        const session = await getSession() as Session;
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

export const updateUsersAction = createAsyncThunk('UPDATE_USER_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch("/api/user", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...arg }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(userUpdate({ id: arg._id, changes: { ...arg } }));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})

export const getUserDetailsAction = createAsyncThunk('GET_USERS_BY_EMAIL', async (arg: string, { getState }) => {
    try {
        const session = await getSession() as Session | any;
        const res = await fetch(`/api/user-exists?email=${session?.user?.user?.email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
        }).then((res) => res.json());
        return res.user;
    } catch (error: any) {
        return error;
    }
});

export const changePassword = createAsyncThunk('CHANGE_USERS_PASSWORD', async (args: { _id: string, old_password: string, confirm_password: string }, { getState }) => {
    try {
        const session = await getSession() as Session;
        const res = await fetch(`/api/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify(args)
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error: any) {
        return error;
    }
});