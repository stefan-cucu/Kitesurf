/*
 * Module for handling spot state management
 */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
const { REACT_APP_MOCKUP_API } = process.env;

// Spot data type
export interface Spot {
    id: string;
    createdAt: Date;
    name: string;
    country: string;
    lat: string;
    long: string;
    probability: number;
    month: 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
}

// Spot array wrapper type
export interface SpotStorage {
    spots: Spot[];
    status: 'loading' | 'loaded' | 'failed';
}

const initialState: SpotStorage = {
    spots: [],
    status: 'loading',
};

export const loadSpots = createAsyncThunk("spot/loadSpots", async () => {
    const getResponse = await fetch(`${REACT_APP_MOCKUP_API}/spot`);
    // console.log(await getResponse.json());
    if (getResponse.ok) {
        return await getResponse.json() as Spot[];
    }
    else
        throw new Error(getResponse.statusText);
});

export const spotSlice = createSlice({
    name: "spot",
    initialState,
    reducers: {
        setSpots: (state, action: PayloadAction<Spot[]>) => {
            state.spots = action.payload;
            state.status = 'loaded';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadSpots.fulfilled, (state, action) => {
            state.spots = action.payload;
            state.status = 'loaded';
        });
        builder.addCase(loadSpots.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(loadSpots.pending, (state, action) => {
            state.status = 'loading';
        });
    },
});

export const { setSpots } = spotSlice.actions;

export const getSpots = (state: any) => state.spot.spots;
export const getSpotsCenter = (state: any) => {
    const spots = getSpots(state);
    const lat = spots.map((spot: { lat: any; }) => spot.lat).reduce((a: any, b: any) => a + b, 0) / spots.length;
    const long = spots.map((spot: { long: any; }) => spot.long).reduce((a: any, b: any) => a + b, 0) / spots.length;
    return { lat, long };
};

export default spotSlice.reducer;

