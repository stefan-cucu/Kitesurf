/*
 * Module for handling user state management
 */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
const { REACT_APP_MOCKUP_API } = process.env;

// User data type
export interface User {
  id: number;
  createdAt: Date;
  name: string;
  avatar: string;
  email: string;
  status: "logged-in" | "logged-out" | "loading" | "failed";
}

// Initial state of the user slice
const initialState: User = {
  id: 0,
  createdAt: new Date(),
  name: "",
  avatar: "",
  email: "",
  status: "logged-out",
};

// Function to login the user
export const logIn = createAsyncThunk("user/logIn", async (userInfo: any) => {
  const username = userInfo.username;
  const password = userInfo.password;

  // Fetch user id from the server
  const putResponse = await fetch(`${REACT_APP_MOCKUP_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  // Check if the login was successful
  let user: any;
  if (putResponse.ok) {
    user = await putResponse.json();
  } else {
    throw new Error(putResponse.statusText);
  }

  // Because the random user id may be larger than the available number of users,
  // modulo the user id to get a valid user id
  const getUsersResponse = await fetch(`${REACT_APP_MOCKUP_API}/users`);
  const users = await getUsersResponse.json();
  user.userId = user.userId % (users.length - 3) + 3;

  // Get user data based on the id
  const getResponse = await fetch(
    `${REACT_APP_MOCKUP_API}/user/${user.userId}`
  );
  if (getResponse.ok) 
    return await getResponse.json();
  else
    throw new Error(getResponse.statusText);
});

// Configure user slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer to manually set the user status
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.createdAt = action.payload.createdAt;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
      state.email = action.payload.email;
      state.status = "logged-in";
    },
    // Reducer to handle the logout action
    logOut: (state) => {
      state.id = 0;
      state.createdAt = new Date();
      state.name = "";
      state.avatar = "";
      state.email = "";
      state.status = "logged-out";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login states
      .addCase(logIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = "logged-in";
        state.id = action.payload.id;
        state.createdAt = new Date(action.payload.createdAt);
        state.name = action.payload.name;
        state.avatar = action.payload.avatar;
        state.email = action.payload.email;
      })
      .addCase(logIn.rejected, (state) => {
        state.status = "failed";
        state.id = 0;
        state.createdAt = new Date();
        state.name = "";
        state.avatar = "";
        state.email = "";
      });
  },
});

export const { setUser, logOut } = userSlice.actions;

// Getter to access the user slice
export const selectUser = (state: any) => state.user;

export default userSlice.reducer;
