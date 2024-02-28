import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { myClientsAddOne, myClientsRemoveOne, myClientsUpdateOne } from '.';

export const getMyClientsListAction = createAsyncThunk('GET_MYCLIENTS_COLLECTION', async (_arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session;
        const response: any = await fetch(`/api/my-clients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
            },
        }).then((res) => res.json());
        if (response.code) {
            message.error("Invalid Session, Please login again");
        }
        return response.myClientList;
    } catch (error: any) {
        return error;
    }
});

// Create clients
export const createMyClientsAction = createAsyncThunk('CREATE_MYCLIENTS_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session | any;
        const response: any = await fetch(`/api/my-clients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: JSON.stringify({ ...arg, uuid: session.user.user.id }),
        }).then((res) => res.json());
        if (response.code) {
            message.error("Invalid Session, Please login again");
        } else {
            dispatch(myClientsAddOne(response.data));
            message.success("Client created successfully.");
        }
        return response;
    } catch (error: any) {
        return error;
    }
});


// Update clients
export const updateMyClientsAction = createAsyncThunk('UPDATE_MYCLIENTS_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session | any;
        const response: any = await fetch(`/api/my-clients`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: JSON.stringify({ ...arg, uuid: session.user.user.id }),
        }).then((res) => res.json());
        if (response.code) {
            message.error("Invalid Session, Please login again");
        } else {
            message.success("Client details updated successfully.");
            dispatch(myClientsUpdateOne({ id: arg._id, changes: { ...arg } }));
        }
        return response;
    } catch (error: any) {
        return error;
    }
});


// Delete clients
export const deleteMyClientAction = createAsyncThunk('DELETE_MYCLIENTS_ACTION', async (arg: { _id: string }, { dispatch }) => {
    try {
        const { _id } = arg;
        const session = await getSession() as Session;
        const res = await fetch("/api/my-clients", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(myClientsRemoveOne(_id));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})


