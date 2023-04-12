import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const userDetails = localStorage.getItem("user");
const token = localStorage.getItem("token");
const user = userDetails && jwtDecode(userDetails);
const tokenPresent = !!user && !!token;

const initialState = {
  isLoggedIn: tokenPresent,
  userDetails: user,
  email: "",
  password: "",
  teacherSignup: {},
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
    },
    logout(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
    updateUser(state, action) {
      state.userDetails = action.payload;
    },
    updateTeacher(state, action) {
      Object.assign(state.teacherSignup, action.payload);
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
