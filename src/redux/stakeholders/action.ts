import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { stakeholdersRemoveOne } from '.';

message.config({
    top: 10,
    duration: 30,
    maxCount: 2,
});

export const getInvestorListAction = createAsyncThunk('GET_INVESTOR_COLLECTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session;
        const response: any = await fetch(`/api/investors`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
            },
        }).then((res) => res.json());
        if (response.code) {
            message.error("Invalid Session, Please login again");
        }
        return response.investorList;
    } catch (error: any) {
        return error;
    }
});

// Create investors
export const createInvestorAction = createAsyncThunk('CREATE_INVESTOR_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session | any;
        const response: any = await fetch(`/api/investors`, {
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
            message.success("Investor created successfully.");
        }
        return response;
    } catch (error: any) {
        return error;
    }
});


// Update investors
export const updateInvestorAction = createAsyncThunk('UPDATE_INVESTOR_ACTION', async (arg: any, { dispatch }) => {
    try {
        const session = await getSession() as Session | any;
        const response: any = await fetch(`/api/investors`, {
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
            message.success("Investor updated successfully.");
        }
        return response;
    } catch (error: any) {
        return error;
    }
});


// Delete Investors
export const deleteInvestorAction = createAsyncThunk('DELETE_INVESTOR_ACTION', async (arg: { _id: string }, { dispatch }) => {
    try {
        const { _id } = arg;
        const session = await getSession() as Session;
        const res = await fetch("/api/investors", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id }),
        }).then((res) => res.json());
        if (res.success) {
            message.success(res.message);
            dispatch(stakeholdersRemoveOne(_id));
        } else {
            message.error(res.message);
        }
        return res;
    } catch (error) {
        return error;
    }
})


