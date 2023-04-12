import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./LoginReducer";
import sidebarSlice from "./SidebarReducer";
import modalSlice from "./ModalReducer";
import questionsSlice from "./QuestionsReducer";
import screenSlice from "./ScreenReducer";

const rootReducer = combineReducers({
  login: loginSlice.reducer,
  sidebar: sidebarSlice.reducer,
  modal: modalSlice.reducer,
  questions: questionsSlice.reducer,
  screen: screenSlice.reducer,
});

export default rootReducer;
