import React from "react";
import Tags from "./Tags";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";
import LeftSidebarContent from "./LeftSidebarContent";

const LeftSidebar = () => {
  const dispatch = useDispatch();
  return (
    <div className="hidden lg:flex w-full lg:w-1/4 h-full lg:mt-[80px]">
      <LeftSidebarContent />
    </div>
  );
};

export default LeftSidebar;
