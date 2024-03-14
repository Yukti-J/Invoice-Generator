import { createSlice} from "@reduxjs/toolkit";

interface UserState {
    userId: string;
}

const initialState: UserState = {
    userId: ""
};

export const userSlice = createSlice({
    name: 'userId',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;