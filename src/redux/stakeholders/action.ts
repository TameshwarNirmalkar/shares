import { createAsyncThunk } from '@reduxjs/toolkit';

export const createProductCollectionAction = createAsyncThunk('GET_PRODUCT_COLLECTION', async (arg: any, { dispatch }) => {
    try {
        const res = await fetch("https://fakestoreapi.com/products").then((res) => res.json());
        return res;
    } catch (error: any) {
        return error;
    }
});