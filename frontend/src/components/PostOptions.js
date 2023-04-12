import React from "react";
import axios from "axios";
import { url } from "./../Constants/Url";
import { toast } from "react-toastify";

const PostOptions = ({ user, question }) => {
  const reportQuestion = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const body = {};
    try {
      await axios.post(
        `${url}/questions/reportQuestion/${question?._id}`,
        body,
        config
      );
      toast("The question was reported");
    } catch (err) {
      if ((err.status = 401)) {
        toast("You are not authorized");
      } else {
        toast("Something went wrong");
      }
    }
  };

  const hideQuestion = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const body = {};
    try {
      await axios.post(
        `${url}/questions/hideQuestion/${question?._id}`,
        body,
        config
      );
      toast("The question was hidden");
    } catch (err) {
      if ((err.status = 401)) {
        toast("You are not authorized");
      } else {
        toast("Something went wrong");
      }
    }
  };
  return (
    <div className="w-full h-full bg-[#ebedf0] shadow-lg py-2 px-8 cursor-pointer overflow-visible z-50 ">
      <p onClick={reportQuestion} className="py-1">
        report
      </p>
      {user !== null && user._id === question?.user_id?._id && (
        <p className="py-1">edit</p>
      )}
      {user !== null && user._id === question?.user_id?._id && (
        <p className="py-1" onClick={hideQuestion}>
          {question.question_hidden ? "unhide" : "hide"}
        </p>
      )}
    </div>
  );
};

export default PostOptions;
