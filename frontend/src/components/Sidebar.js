import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import Tags from "./Tags";
import { url, baseURL } from "./../Constants/Url";
import { Avatar } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import LeftSidebar from "./LeftSideBar";
import LoginIcon from "@mui/icons-material/Login";
import { modalActions } from "../Redux/ModalReducer";

const SideBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const user = useSelector((state) => state.login.userDetails);

  return (
    <div
      className={`${
        isSidebarOpen ? "right-0" : "-right-full"
      } lg:hidden fixed w-2/4 md:w-2/5 h-screen bg-white text-black shadow-lg z-1000 top-[120px] prose transition-right duration-500 ease-in-out`}
    >
      {isLoggedIn ? (
        <div className="w-full">
          <Link to={`/profile/${user._id}`}>
            <Avatar
              alt="Remy Sharp"
              sx={{ width: "100px", height: "100px" }}
              src={
                user?.user_image && user?.user_image.includes("https://")
                  ? `${user?.user_image}`
                  : `${baseURL}/static/users/${user?.user_image}`
              }
              className="cursor-pointer m-auto my-4"
            />
          </Link>
          <div className="w-full flex flex-col px-8 py-4 text-md md:text-lg border-grayLight">
            <Link to={`/profile/${user._id}`} className="no-underline">
              <div className="cursor-pointer py-2 m-auto ">Profile</div>
            </Link>
            <Link className="no-underline">
              <div
                onClick={() => dispatch(modalActions.openChangePasswordModal())}
                className="cursor-pointer py-2 m-auto "
              >
                Change Password
              </div>
            </Link>
            <Link to="/" className="no-underline">
              <div className="cursor-pointer py-2 m-auto ">Logout</div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full px-8 pt-4">
          <button
            className="flex justify-between border border-primary lg:border-white rounded-sm text-primary lg:text-white text-md font-medium px-[30px] lg:px-4 py-2 my-4 lg:my-2"
            onClick={() => dispatch(modalActions.openLoginModal())}
          >
            <LoginIcon className="mr-2" />
            LOGIN
          </button>
          <button
            className="flex justify-between border border-primary lg:border-white rounded-sm text-primary lg:text-white text-md font-medium px-4 py-2 my-4 lg:my-2"
            onClick={() => dispatch(modalActions.openSignupModal())}
          >
            <HowToRegIcon className="mr-2" />
            REGISTER
          </button>
        </div>
      )}
      <LeftSidebar />

      <div className="px-8"> {/* <Tags /> */}</div>
    </div>
  );
};

export default SideBar;
