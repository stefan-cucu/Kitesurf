// Module to handle the user logic
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
const { REACT_APP_MOCKUP_API } = process.env;

export interface User {
    id: number;
    createdAt: Date;
    name: string;
    avatar: string;
    email: string;
    status: 'logged-in' | 'logged-out' | 'loading';
}

const initialState: User = {
    id: 0,
    createdAt: new Date(),
    name: '',
    avatar: '',
    email: '',
    status: 'logged-out',
};

// Function to login the user
// Given that the mock API cannot handle authentication, we will just set the user status to logged-in
export const logIn = createAsyncThunk(
    'user/logIn',
    async (username: string) => {
        console.log(`${REACT_APP_MOCKUP_API}/user/${username}`)
        const response = await fetch(`${REACT_APP_MOCKUP_API}/user/${username}`);
        const data = await response.json();
        console.log(data);
        return data;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.createdAt = action.payload.createdAt;
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.email = action.payload.email;
            state.status = 'logged-in';
        },
        logOut: (state) => {
            state.id = 0;
            state.createdAt = new Date();
            state.name = '';
            state.avatar = '';
            state.email = '';
            state.status = 'logged-out';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.status = 'logged-in';
                state.id = action.payload.id;
                state.createdAt = action.payload.createdAt;
                state.name = action.payload.name;
                state.avatar = action.payload.avatar;
                state.email = action.payload.email;
            })
            .addCase(logIn.rejected, (state) => {
                state.status = 'logged-out';
            });
    },
});

export const { setUser, logOut } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
