import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUsersCollectionAction = createAsyncThunk('GET_USERS_COLLECTION', async (arg: any, { getState }) => {
    try {
        const res = await fetch(`/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRHVtbXkgdXNlciIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlkIjoiNjViZTdjNzFiNmQ3ZmIwY2RkN2VjOWIwIiwiaW1hZ2UiOiJodHRwczovL21lZGlhLmlzdG9ja3Bob3RvLmNvbS9pZC80OTY0ODg4MzgvcGhvdG8vaW5xdWlzaXRpdmUtYmVhZ2xlLWhvdW5kLmpwZz9zPTIwNDh4MjA0OCZ3PWlzJms9MjAmYz1hd1JOWlVJeFJ5RUd3Z1kxazhhNUxDclkwN1dSR0tiM2JRd2hBVHJGZnZBPSIsImV4cCI6MTcwODI3MTI1Nn0.iQ3T1Ysinsd6I2LxvIlj6gLjP7wMvea-Y9yw1PHhbzI"}`,
            },
        }).then((res) => res.json());
        return res.userList;
    } catch (error: any) {
        console.log("error ", error);
        return error;
    }
});