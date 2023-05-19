import React, { useState, useEffect, useRef } from "react";
import Home from "./../Images/home.jpg";
import Signup from "./../Images/signup.jpg";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";
import { Dialog } from "@mui/material";
import ResetPassword from "./ResetPassword";
import { loginActions } from "../Redux/LoginReducer";
import jwtDecode from "jwt-decode";
const sign = require("jwt-encode");

const LandingPage = ({ openmodal }) => {
  const [page, setPage] = useState("");
  const [user_id, setUserId] = useState("");
  const [token, setToken] = useState("");
  const aboutRef = useRef();

  const isResetPasswordModalOpen = useSelector(
    (state) => state.modal.isResetPasswordModalOpen
  );

  const location = useLocation();
  const path = location.pathname.split("/");

  console.log("location", location.pathname.split("/")[1]);
  console.log("location", location.pathname.split("/")[0]);
  // const query = new URLSearchParams(search);
  // const scroll = query.get("section");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   window.scrollTo("#about");
  //   if (scroll) {
  //     scroll.current?.scrollIntoView({ behavior: "smooth" });
  //   } else {
  //     window.scrollTo(0, 0);
  //   }
  // }, [scroll]);

  const setLoginState = () => {
    dispatch(loginActions.login());
    dispatch(modalActions.closeLoginModal());
  };

  const userHandler = (data) => {
    dispatch(loginActions.updateUser(data));
  };

  const userLogin = () => {
    const userDetails = jwtDecode(path[3]);
    localStorage.setItem("token", path[3]);
    const jwt = sign(userDetails.user, "answerout123");
    localStorage.setItem("user", jwt);
    userHandler(userDetails.user);
    setLoginState();
  };

  useEffect(() => {
    setUserId(path[2]);
    setToken(path[3]);
    if (location.pathname.split("/")[1] === "resetpassword") {
      dispatch(modalActions.openResetPasswordModal());
    } else if (location.pathname.split("/")[1] === "oauth") {
      userLogin();
    }
  }, []);
  console.log("token useeff", path[2], token);

  return (
    <>
      <div className="bg-white lg:pt-[80px]">
        <div className="w-full lg:h-[500px] flex flex-col-reverse lg:flex-row justify-center pl-4 lg:pl-0 lg:p-16">
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <p className="w-full font-extrabold text-2xl lg:text-5xl mt-32">
              Questions Lead to{" "}
              <span>
                Better <span className="text-primary">Solutions</span>
              </span>
            </p>
            <div className="w-full mt-2 md:mt-8 md:pr-8 flex text-sm mb-8 md:mb-0">
              <Link to="/BrowsePosts">
                <Button variant="outlined" sx={{ color: "#6CD8F0" }}>
                  Browse Questions
                </Button>
              </Link>
              <Button
                variant="filled"
                sx={{
                  background: "#6CD8F0",
                  color: "#ffffff",
                  marginLeft: "8px",
                }}
              >
                Ask Question
              </Button>
            </div>
          </div>
          <div className="hidden lg:block w-10/12 h-10/12 lg:w-1/3">
            <img src={Home} alt="img" className="w-full h-full" />
          </div>
        </div>
        <div
          id="about-us"
          ref={aboutRef}
          className="w-full flex flex-col justify-center items-center pt-4 lg:pt-0 lg:p-8 px-2 lg:px-16"
        >
          <p className="font-extrabold text-2xl lg:text-5xl">
            What is AnswerOut?{" "}
          </p>
          <p className="w-full lg:w-2/4 font-normal text-sm lg:text-lg pt-8 tracking-wide">
            AnswerOut is an online platform that places emphasis on using the
            benefit of shared interests to draw people especially students
            seeking answers to their questions. The users put up questions
            expecting an answer and go through previously asked questions where
            they might find their answer or even get more information about a
            similar topic.
          </p>
        </div>
        <div className="w-full pb-4 lg:p-8 lg:px-16 flex flex-col lg:flex-row justify-center lg:justify-around ">
          <div className="w-full lg:w-2/5">
            <img src={Signup} alt="" className="w-full h-full" />
          </div>
          <div className="flex flex-col items-center justify-center lg:w-2/5 lg:pt-32">
            <p className="font-extrabold text-2xl lg:text-5xl ">Get Started</p>
            <p className="font-normal text-md lg:text-lg pt-4 lg:pt-8 tracking-wide">
              Signup now and start asking questions.
            </p>
            <div className="mt-2 lg:mt-8 pr-8 flex">
              <Link to="/BrowsePosts">
                <Button variant="outlined" sx={{ color: "#6CD8F0" }}>
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={isResetPasswordModalOpen}
        onClose={() => dispatch(modalActions.closeResetPasswordModal())}
      >
        <ResetPassword id={user_id} token={token} />
      </Dialog>
    </>
  );
};

export default LandingPage;
