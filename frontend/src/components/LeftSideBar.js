import React from "react";
import Tags from "./Tags";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";

const LeftSidebar = () => {
  const dispatch = useDispatch();
  return (
    <div className="hidden lg:flex w-full lg:w-1/4 h-full lg:mt-[80px]">
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
    </div>
  );
};

export default LeftSidebar;
