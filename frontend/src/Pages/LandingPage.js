import React, { useState, useEffect, useRef } from "react";
import Home from "./../Images/home.jpg";
import Signup from "./../Images/signup.jpg";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";
import { Dialog } from "@mui/material";
import ResetPassword from "./ResetPassword";

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
  useEffect(() => {
    if (location.pathname.split("/")[1] === "resetpassword") {
      dispatch(modalActions.openResetPasswordModal());
      setUserId(path[2]);
      setToken(path[3]);
    }
  }, []);

  return (
    <>
      <div className="bg-white lg:pt-[80px]">
        <div className="w-full lg:h-[500px] flex flex-col lg:flex-row justify-center pl-4 lg:pl-0 lg:p-16">
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <p className="w-full font-extrabold text-2xl lg:text-5xl mt-32">
              Questions Lead to{" "}
              <span>
                Better <span className="text-primary">Solutions</span>
              </span>
            </p>
            <div className="w-full mt-8 pr-8 flex">
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
          <div className="w-full lg:w-1/3">
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
        <div className="w-full lg:p-8 lg:px-16 lg:flex justify-around ">
          <div className="w-full lg:w-2/5">
            <img src={Signup} alt="" className="w-full h-full" />
          </div>
          <div className="w-2/5 lg:pt-32">
            <p className="font-extrabold text-2xl lg:text-5xl ">Get Started</p>
            <p className="w-full font-normal text-md lg:text-lg pt-8 tracking-wide">
              Signup now and start asking questions.
            </p>
            <div className="w-full mt-8 pr-8 flex">
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
