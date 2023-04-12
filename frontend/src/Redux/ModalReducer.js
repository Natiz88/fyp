import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isPostModalOpen: false,
  isEditModalOpen: false,
  isTeacherModalOpen: false,
  isResetPasswordModalOpen: false,
  isForgotPasswordModalOpen: false,
  isChangePasswordModalOpen: false,
  isContactUsModalOpen: false,
  email: "",
  password: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal(state) {
      state.isLoginModalOpen = true;
    },
    closeLoginModal(state) {
      state.isLoginModalOpen = false;
    },
    openSignupModal(state) {
      state.isSignupModalOpen = true;
    },
    closeSignupModal(state) {
      state.isSignupModalOpen = false;
    },
    openEditProfileModal(state) {
      state.isEditProfileModalOpen = true;
    },
    closeEditProfileModal(state) {
      state.isEditProfileModalOpen = false;
    },
    openPostModal(state) {
      state.isPostModalOpen = true;
    },
    closePostModal(state) {
      state.isPostModalOpen = false;
    },
    openChangePasswordModal(state) {
      state.isChangePasswordModalOpen = true;
    },
    closeChangePasswordModal(state) {
      state.isChangePasswordModalOpen = false;
    },
    openTeacherModal(state) {
      state.isTeacherModalOpen = true;
    },
    closeTeacherModal(state) {
      state.isTeacherModalOpen = false;
    },
    openResetPasswordModal(state) {
      state.isResetPasswordModalOpen = true;
    },
    closeResetPasswordModal(state) {
      state.isResetPasswordModalOpen = false;
    },
    openForgotPasswordModal(state) {
      state.isForgotPasswordModalOpen = true;
    },
    closeForgotPasswordModal(state) {
      state.isForgotPasswordModalOpen = false;
    },
    openContactUsModal(state) {
      console.log("contactus");
      state.isContactUsModalOpen = true;
    },
    closeContactUsModal(state) {
      state.isContactUsModalOpen = false;
    },
    setCredentials(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    emptyCred(state) {
      state.email = "";
      state.password = "";
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice;
