import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { stakeholdersRemoveOne } from '.';

message.config({
    top: 10,
    duration: 100,
    maxCount: 3,
});

export const getInvestorListAction = createAsyncThunk('GET_PRODUCT_COLLECTION', async (arg: any, { dispatch }) => {
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


// Update investors


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


