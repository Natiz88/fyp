import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "./../Images/logo.png";
import { useQuery, useQueryClient } from "react-query";
import Login from "./Login";
import Signup from "./Signup";
import TeacherSignup from "./TeacherSignup";
import Notifications from "../components/Notifications";
import SearchBar from "../components/SearchBar";
import { Dialog } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import LoginButtons from "../components/LoginButtons";
import { modalActions } from "../Redux/ModalReducer";
import { sidebarActions } from "../Redux/SidebarReducer";
import Close from "@mui/icons-material/Close";
import axios from "axios";
import { url } from "./../Constants/Url";
import { GetDate } from "./../Constants/GetDate";
import ChangePassword from "./ChangePassword";
import ContactUs from "./ContactUs";
import ForgotPassword from "./ForgotPassword";
import { SocketContext } from "./../Socket";
import useOutsideClick from "../hooks/useOutsideClick";
import AvatarImage from "./../Images/avatar.png";

function Navbar() {
  const queryClient = useQueryClient();
  const socket = React.useContext(SocketContext);

  useEffect(() => {
    socket.on("receive_notification", () => {
      queryClient.invalidateQueries("notifications");
    });
  }, []);
  useEffect(() => {
    socket.on("receive_coins", () => {
      queryClient.invalidateQueries("coins");
    });
  }, []);

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const user = useSelector((state) => state.login.userDetails);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const isChangePasswordModalOpen = useSelector(
    (state) => state.modal.isChangePasswordModalOpen
  );
  const isForgotPasswordModalOpen = useSelector(
    (state) => state.modal.isForgotPasswordModalOpen
  );
  const isContactUsModalOpen = useSelector(
    (state) => state.modal.isContactUsModalOpen
  );

  const dispatch = useDispatch();
  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const isTeacherModalOpen = useSelector(
    (state) => state.modal.isTeacherModalOpen
  );
  const isSignupModalOpen = useSelector(
    (state) => state.modal.isSignupModalOpen
  );

  const getCoins = async () => {
    try {
      const response = await axios.get(`${url}/users/getCoins/${user?._id}`);
      console.log("not", response?.data);
      return response?.data?.coins;
    } catch (err) {
      console.log(err);
    }
  };
  const getNotifications = async () => {
    try {
      const response = await axios.get(`${url}/notifications/${user?._id}`);
      return response?.data?.data?.notifications;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: notifications } = useQuery("notifications", () =>
    getNotifications()
  );

  const { data: coins } = useQuery("coins", () => getCoins());

  return (
    <>
      <div className="bg-primary fixed w-full z-10 h-[120px] lg:h-[80px] ">
        <div className="lg:w-full lg:h-full flex justify-between items-center">
          <div className="w-2/6 lg:w-1/4  ">
            <Link to="/">
              <img src={Logo} alt="logo" className="md:w-1/2" />
            </Link>
          </div>
          <div className="w-4/6 lg:w-3/4 h-full flex justify-end lg:justify-around items-center">
            <div className="hidden lg:flex items-center w-2/4 h-full z-50">
              <SearchBar />
            </div>
            {isLoggedIn ? (
              <div className="relative w-10/12 lg:w-2/6">
                {" "}
                <Notifications
                  notifications={notifications}
                  isNotificationsOpen={isNotificationsOpen}
                  handleNotifications={setNotificationsOpen}
                  coins={coins}
                />{" "}
                {isNotificationsOpen && (
                  <div className="absolute w-full overflow-auto bg-white min-h-[20px] max-h-[600px] px-8 py-4 rounded-md shadow-lg">
                    {notifications.length > 0 ? (
                      <div>
                        <p className="text-xl font-bold py-2">Notifications</p>
                        {notifications.map((not) => (
                          <Link to={`/pageDetails/${not?.question}`}>
                            <div className="py-2 flex">
                              <div className="w-1/5">
                                <img
                                  className="w-3/5"
                                  alt="avatar"
                                  src={
                                    not?.sender?.user_image
                                      ? `http://localhost:5000/static/users/${not?.sender?.user_image}`
                                      : AvatarImage
                                  }
                                />
                              </div>
                              <div className="w-4/5">
                                <p className="text-sm md:text-base font-medium">
                                  {not.message}
                                </p>
                                <p className="text-xs">
                                  {GetDate(not.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>No notifications</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-1/3">
                <LoginButtons />
              </div>
            )}
            <div className="w-2/12 pl-4 lg:hidden">
              {isSidebarOpen ? (
                <CloseIcon
                  className="transition-all duration-600 ease-in"
                  onClick={() => dispatch(sidebarActions.closeSidebar())}
                />
              ) : (
                <MenuIcon
                  className="transition transform duration-1000 ease-in"
                  onClick={() => dispatch(sidebarActions.openSidebar())}
                />
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden h-[60px] w-11/12 m-auto">
          <SearchBar />
        </div>
      </div>

      <Dialog
        open={isLoginModalOpen}
        onClose={() => dispatch(modalActions.closeLoginModal())}
      >
        <Login />
      </Dialog>

      <Dialog
        open={isTeacherModalOpen}
        onClose={() => dispatch(modalActions.closeTeacherModal())}
      >
        <TeacherSignup />
      </Dialog>

      <Dialog
        open={isSignupModalOpen}
        onClose={() => dispatch(modalActions.closeSignupModal())}
      >
        <Signup />
      </Dialog>
      <Dialog
        open={isChangePasswordModalOpen}
        onClose={() => dispatch(modalActions.closeChangePasswordModal())}
      >
        <ChangePassword />
      </Dialog>

      <Dialog
        open={isForgotPasswordModalOpen}
        onClose={() => dispatch(modalActions.closeForgotPasswordModal())}
      >
        <ForgotPassword />
      </Dialog>

      <Dialog
        open={isContactUsModalOpen}
        onClose={() => dispatch(modalActions.closeContactUsModal())}
      >
        <ContactUs />
      </Dialog>
    </>
  );
}

export default Navbar;
