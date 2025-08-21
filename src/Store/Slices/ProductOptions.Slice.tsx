import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    category: [],
    material: [],
    size: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCategory(state, action) {
            state.category = action.payload;
        },
        setMaterial(state, action) {
            state.material = action.payload;
        },
        setSize(state, action) {
            state.size = action.payload;
        }
    },
});

export const { setCategory, setMaterial, setSize } = authSlice.actions;
export default authSlice.reducer;
