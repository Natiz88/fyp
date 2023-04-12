import React from "react";
import { Button } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import { modalActions } from "../Redux/ModalReducer";
import { useSelector, useDispatch } from "react-redux";

const LoginButtons = () => {
  const dispatch = useDispatch();

  return (
    <div className="hidden w-full h-full lg:flex lg:justify-around">
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
      {/* <Button
        variant="outlined"
        startIcon={<HowToRegIcon />}
        sx={{ borderColor: "white", color: "white" }}
        onClick={() => dispatch(modalActions.openSignupModal())}
      >
        Register
      </Button> */}
    </div>
  );
};

export default LoginButtons;
