import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { errorCodes } from "./../Constants/ErrorCodes";
import { url } from "./../Constants/Url";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { modalActions } from "../Redux/ModalReducer";
import { screenActions } from "./../Redux/ScreenReducer";
const sign = require("jwt-encode");

function ForgotPassword() {
  const [isError, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch(screenActions.loadScreen());
    setError(false);
    const config = {
      header: {
        Accept: "application/json",
      },
    };
    try {
      await axios.post(`${url}/users/sendLink`, { email }, config);
      setSuccess(true);
    } catch (err) {
      const error = err?.response?.status;
      setError(true);
      setErrorMsg(errorCodes?.[error] || "Something went wrong");
    }
    dispatch(screenActions.stopLoading());
  };

  return (
    <div>
      {!success ? (
        <form onSubmit={loginHandler} className="w-full" autoComplete="off">
          <Card className="w-full p-8">
            <div className="flex items-center justify-between mb-4">
              {" "}
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <h1 className="w-full font-semibold text-2xl">Forgot Password</h1>
            </div>
            <Grid container direction="row">
              {isError && (
                <Grid item xs={12}>
                  <p className="text-error">{errorMsg}</p>
                </Grid>
              )}
              <Grid item xs={12} spacing={3}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1, mb: 1, p: 1.5 }}
                >
                  Send Link
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>
      ) : (
        <div className="p-8">
          <p className="">A reset link has been sent to your email</p>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
