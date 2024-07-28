import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logoutUser, userLogin, userSignup } from "../actions/userAction";

// Define the types
type User = {
    name: string;
    email: string;
    gender: string;
    imageUrl: string;
};

type UserData = {
    user: User | null; // User can be null initially
    userLoading: boolean;
    userError: string | null;
};

type InitialState = {
    value: UserData;
};

// Define the initial state
const initialState: InitialState = {
    value: {
        user: null,
        userLoading: false,
        userError: null,
    },
};

// Create the slice
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUserStart(state) {
            state.value.userLoading = true;
            state.value.userError = null;
        },
        fetchUserSuccess(state, action: PayloadAction<User>) {
            state.value.user = action.payload;
            state.value.userLoading = false;
        },
        fetchUserFailure(state, action: PayloadAction<string>) {
            state.value.userLoading = false;
            state.value.userError = action.payload;
        },
        clearUser(state) {
            state.value.user = null;
            state.value.userLoading = false;
            state.value.userError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.value.userLoading = true;
            })
            .addCase(userLogin.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
                state.value.userLoading = false;
                state.value.user = action.payload.user;
            })
            .addCase(userLogin.rejected, (state, action: PayloadAction<string>) => {
                state.value.userLoading = false;
                state.value.userError = action.payload;
            })
            .addCase(userSignup.pending, (state) => {
                state.value.userLoading = true;
            })
            .addCase(userSignup.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
                state.value.userLoading = false;
                state.value.user = action.payload.user;
            })
            .addCase(userSignup.rejected, (state, action: PayloadAction<string>) => {
                state.value.userLoading = false;
                state.value.userError = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.value.userLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.value.userLoading = false;
                state.value.user = null;
            })
            .addMatcher(
                (action): action is PayloadAction<string> =>
                    [
                        userSignup.rejected.type,
                        userLogin.rejected.type,
                    ].includes(action.type),
                (state, action) => {
                    state.value.userLoading = false;
                    state.value.userError = action.payload;
                    state.value.user = null;
                }
            );
    },
});

// Export actions
export const {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    clearUser,
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
