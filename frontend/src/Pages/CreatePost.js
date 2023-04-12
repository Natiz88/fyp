import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { Dialog } from "@mui/material";
import Login from "./Login";
import CreatePostContent from "../components/CreatePostContent";
import { modalActions } from "../Redux/ModalReducer";

const CreatePost = () => {
  const isPostModalOpen = useSelector((state) => state.modal.isPostModalOpen);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const dispatch = useDispatch();

  return (
    <>
      <div className="fixed bottom-8 right-8 p-4 bg-primary rounded-full cursor-pointer">
        <AddIcon
          fontSize="medium"
          onClick={() => dispatch(modalActions.openPostModal())}
        />
      </div>
      <Dialog
        open={isPostModalOpen}
        onClose={() => dispatch(modalActions.closePostModal())}
      >
        {isLoggedIn ? <CreatePostContent /> : <Login />}
      </Dialog>
    </>
  );
};

export default CreatePost;
