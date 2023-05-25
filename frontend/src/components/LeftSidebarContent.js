import React from "react";
import Tags from "./Tags";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";

const LeftSidebarContent = () => {
  const dispatch = useDispatch();
  return (
    <div className="bg-white p-4 mt-4 mx-2 w-full rounded-lg">
      <Link to="/">
        <p className="font-semibold text-base py-1 cursor-pointer">Home</p>
      </Link>
      <Link to="/BrowsePosts">
        <p className="font-semibold text-base py-1 cursor-pointer">
          All Questions
        </p>
      </Link>
      <p
        onClick={() => dispatch(modalActions.openPostModal())}
        className="font-semibold text-base py-1 cursor-pointer"
      >
        Ask Question
      </p>
      <Tags />
    </div>
  );
};

export default LeftSidebarContent;
