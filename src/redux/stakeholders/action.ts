import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

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