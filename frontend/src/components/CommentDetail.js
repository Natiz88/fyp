import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GetDate } from "../Constants/GetDate";
import { MoreVert } from "@mui/icons-material";
import PostOptions from "./PostOptions";
import VerifiedIcon from "@mui/icons-material/Verified";
import FlagSharpIcon from "@mui/icons-material/FlagSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
import axios from "axios";
import { url, baseURL } from "./../Constants/Url";

const CommentDetail = ({ comment, user, deleteCommentSubmit }) => {
  const [open, setOpen] = useState(false);
  const createdAt = GetDate(comment?.createdAt);

  const reportComment = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const body = {};
    try {
      await axios.put(
        `${url}/comments/reportComment/${comment?._id}`,
        body,
        config
      );
      toast("The comment was reported");
    } catch (err) {
      if ((err.status = 401)) {
        toast("You are not authorized");
      } else {
        toast("Something went wrong");
      }
    }
  };

  // const deleteComment = async () => {
  //   setOpen(false);
  //   const token = localStorage.getItem("token");
  //   const config = {
  //     headers: {
  //       accept: "application/json",
  //       authorization: `Bearer ${token}`,
  //     },
  //   };
  //   try {
  //     await axios.post(
  //       `${url}/comments/deleteComment/${comment._id}`,
  //       {},
  //       config
  //     );
  //     toast("comment was deleted successfully");
  //   } catch (err) {
  //     toast("something went wrong");
  //     console.log(err);
  //   }
  // };
  const submitDeletion = () => {
    setOpen(false);
    deleteCommentSubmit(comment._id);
  };

  return (
    <div className="w-full flex items-center justify-between px-8 overflow-hidden py-2 my-2 relative">
      <div className="w-full">
        <div className="w-full flex justify-between">
          <Link
            to={`/profile/${comment?.user_id._id}`}
            className="flex cursor-pointer w-3/4 "
          >
            <img
              className="rounded-full w-[30px] h-[30px]"
              src={
                comment?.user_id &&
                comment?.user_id?.user_image.includes("https://")
                  ? `${comment?.user_id?.user_image}`
                  : `${baseURL}/static/users/${comment?.user_id?.user_image}`
              }
              alt="img"
            />
            <div className="h-full ml-2 flex justify-between items-center">
              <p className="font-normal text-md">
                {comment?.user_id?.full_name || "John doe"}{" "}
                {comment?.user_id?.user_verified === "positive" && (
                  <VerifiedIcon />
                )}
              </p>
              <p className="text-xs ml-1">{createdAt}</p>
            </div>
          </Link>
        </div>
        <p className="py-1 pl-8">{comment?.comment_body}</p>
        <div className="flex w-full my-2 pl-8 text-grayDark text-sm">
          <p className="cursor-pointer" onClick={reportComment}>
            <FlagSharpIcon /> Report
          </p>
          {user && user.id === comment?.user_id?._id && (
            <p className="cursor-pointer pl-8" onClick={() => setOpen(true)}>
              <DeleteIcon /> Delete
            </p>
          )}
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-8 py-4">
          <div className="text-lg py-4">
            Are you sure you want to delete this comment?
          </div>
          <div className="flex justify-end items-center">
            <Button onClick={() => setOpen(false)}>no</Button>
            <Button className="ml-4" onClick={submitDeletion}>
              yes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CommentDetail;
