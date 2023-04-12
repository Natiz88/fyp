import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import Tags from "./Tags";
import LoginButtons from "./LoginButtons";
import { Avatar } from "@mui/material";
import LeftSidebar from "./LeftSideBar";

const SideBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  return (
    <div
      className={`${
        isSidebarOpen ? "right-0" : "-right-full"
      } lg:hidden fixed w-2/4 md:w-2/5 h-screen bg-white text-black shadow-lg z-1000 top-[120px] prose transition-right duration-500 ease-in-out`}
    >
      {isLoggedIn ? (
        <div className="w-full">
          <div className="">
            <Avatar
              alt="Remy Sharp"
              sx={{ width: "100px", height: "100px" }}
              src=""
              className="cursor-pointer m-auto my-4"
            />
          </div>
          <div className="w-full flex flex-col px-8 py-4 text-md md:text-lg border-grayLight">
            <Link to="/profile" className="no-underline">
              <div className="cursor-pointer py-2 m-auto ">Profile</div>
            </Link>
            <Link to="/profile" className="no-underline">
              <div className="cursor-pointer py-2 m-auto ">Change Password</div>
            </Link>
            <Link to="/" className="no-underline">
              <div className="cursor-pointer py-2 m-auto ">Logout</div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full px-8 pt-4">
          <LoginButtons />
        </div>
      )}
      <LeftSidebar />

      <div className="px-8"> {/* <Tags /> */}</div>
    </div>
  );
};

export default SideBar;
