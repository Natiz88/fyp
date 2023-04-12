import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isScreenLoading: false,
  isScreenMessage: false,
  screenMessage: "",
};

const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setMessage(state, action) {
      state.isScreenMessage = true;
      state.screenMessage = action.payload;
    },
    removeMessage(state) {
      state.isScreenMessage = false;
      state.screenMessage = "";
    },
    loadScreen(state) {
      state.isScreenLoading = true;
    },
    stopLoading(state) {
      state.isScreenLoading = false;
    },
  },
});

export const screenActions = screenSlice.actions;
export default screenSlice;
