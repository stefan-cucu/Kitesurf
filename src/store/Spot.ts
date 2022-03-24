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
  month:
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";
  isFavorite: boolean;
  favoriteId: string;
}

// Spot array wrapper type
export interface SpotStorage {
  spots: Spot[];
  status: "loading" | "loaded" | "failed";
}

// Initial state of the spot slice
const initialState: SpotStorage = {
  spots: [],
  status: "loading",
};

// Function to get the spots from the server
export const loadSpots = createAsyncThunk("spot/loadSpots", async () => {
  // Fetch all spots from the server
  const getResponse = await fetch(`${REACT_APP_MOCKUP_API}/spot`);
  if (!getResponse.ok) throw new Error(getResponse.statusText);
  const spots: Spot[] = await getResponse.json();

  // Fetch favorite spots from the server
  const getFavoritesResponse = await fetch(
    `${REACT_APP_MOCKUP_API}/favourites`
  );
  if (!getFavoritesResponse.ok)
    throw new Error(getFavoritesResponse.statusText);
  const favorites = await getFavoritesResponse.json();

  // Merge spots and favorites
  for (const spot of spots) {
    const favorite = favorites.find((fav: any) => fav.spot == spot.id);
    if (favorite) {
      spot.isFavorite = true;
      spot.favoriteId = favorite.id;
    } else {
      spot.isFavorite = false;
      spot.favoriteId = "";
    }
  }
  return spots;
});

// Function to add a favorite spot
export const addFavoriteSpot = createAsyncThunk(
  "spot/addFavoriteSpot",
  async (spot: string) => {
    const postResponse = await fetch(`${REACT_APP_MOCKUP_API}/favourites/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spot,
      }),
    });
    if (!postResponse.ok) throw new Error(postResponse.statusText);
    return await postResponse.json();
  }
);

// Function to remove a favorite spot
export const removeFavoriteSpot = createAsyncThunk(
  "spot/removeFavoriteSpot",
  async (id: number) => {
    const deleteResponse = await fetch(
      `${REACT_APP_MOCKUP_API}/favourites/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!deleteResponse.ok) throw new Error(deleteResponse.statusText);
    return id;
  }
);

// Configure spot slice
export const spotSlice = createSlice({
  name: "spot",
  initialState,
  reducers: {
    // Reducer for loading the spots
    setSpots: (state, action: PayloadAction<Spot[]>) => {
      state.spots = action.payload;
      state.status = "loaded";
    },
  },
  extraReducers: (builder) => {
    // Handle spot loading status
    builder.addCase(loadSpots.fulfilled, (state, action) => {
      state.spots = action.payload;
      state.status = "loaded";
    });
    builder.addCase(loadSpots.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(loadSpots.pending, (state, action) => {
      state.status = "loading";
    });
    // Set spot as favorite in the state
    builder.addCase(addFavoriteSpot.fulfilled, (state, action) => {
      const id = action.payload.spot;
      const favId = action.payload.id;
      const index = state.spots.findIndex((spot: Spot) => spot.id == id);
      state.spots[index].isFavorite = true;
      state.spots[index].favoriteId = favId;
    });
    // Remove spot from favorites in the state
    builder.addCase(removeFavoriteSpot.fulfilled, (state, action) => {
      const id = action.payload;
      const index = state.spots.findIndex(
        (spot: Spot) => parseInt(spot.favoriteId) == id
      );
      state.spots[index].isFavorite = false;
      state.spots[index].favoriteId = "";
    });
  },
});

export const { setSpots } = spotSlice.actions;

// Get the spots from the state
export const getSpots = (state: any) => state.spot.spots;

export default spotSlice.reducer;
