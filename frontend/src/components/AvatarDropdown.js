import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import { modalActions } from "../Redux/ModalReducer";

const AvatarDropdown = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.userDetails);

  const logoutHandler = () => {
    dispatch(loginActions.logout());
  };
  return (
    <>
      <div className="absolute top-full -left-6 shadow-lg mt-1">
        <div className="w-full bg-white px-6 py-2 cursor-pointer">
          <Link to={`/profile/${user?._id}`}>Profile</Link>
        </div>
        <div
          className="w-full bg-white px-6 py-2 cursor-pointer"
          onClick={() => dispatch(modalActions.openChangePasswordModal())}
        >
          Change Password
        </div>
        <div
          className="w-full bg-white px-6 py-2 cursor-pointer"
          onClick={logoutHandler}
        >
          Logout
        </div>
      </div>
    </>
  );
};

export default AvatarDropdown;
