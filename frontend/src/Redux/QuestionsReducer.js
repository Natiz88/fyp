import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    updateQuestions(state, action) {
      state.questions = action.payload;
    },
  },
});

export const questionsActions = questionsSlice.actions;
export default questionsSlice;
