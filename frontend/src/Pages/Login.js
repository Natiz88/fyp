import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { errorCodes } from "./../Constants/ErrorCodes";
import { url } from "./../Constants/Url";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "./../Images/bulb.png";
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
import { toast } from "react-toastify";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { modalActions } from "../Redux/ModalReducer";
const sign = require("jwt-encode");

function Login() {
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.modal.email);
  const password = useSelector((state) => state.modal.password);

  const openSignupModal = () => {
    dispatch(modalActions.closeLoginModal());
    dispatch(modalActions.openSignupModal());
  };

  const google = async () => {
    await window.open("http://localhost:5000/auth/google", "_self");
    const response = await axios.get("http://localhost:5000/auth/logins");
    console.log("log", response);
    localStorage.setItem("log", response);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("please enter a valid email"),
    password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
  });

  const loginFormik = useFormik({
    initialValues: {
      email: email || "",
      password: password || "",
    },
    validationSchema,
    onSubmit: async (data) => {
      console.log(data);
    },
  });

  const setLoginState = () => {
    dispatch(loginActions.login());
    dispatch(modalActions.closeLoginModal());
  };

  const userHandler = (data) => {
    dispatch(loginActions.updateUser(data));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setError(false);
    const loginData = loginFormik.values;
    const config = {
      header: {
        Accept: "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${url}/users/login`,
        loginData,
        config
      );
      const jwt =
        response?.data?.data?.user &&
        sign(response?.data?.data?.user, "answerout123");
      localStorage.setItem("user", jwt);
      const token = response?.data?.token;
      localStorage.setItem("token", token);
      userHandler(response?.data?.data?.user);
      setLoginState();
      navigate("/");
      toast("login successfull");
      dispatch(modalActions.closeLoginModal());
      dispatch(modalActions.emptyCred());
    } catch (err) {
      const error = err?.response?.status;
      setError(true);
      if (error === 401) {
        setErrorMsg("Incorrect Username or Password");
      } else {
        setErrorMsg(errorCodes?.[error] || "Something went wrong");
      }
    }
  };
  const ForgotPassword = () => {
    dispatch(modalActions.closeLoginModal());
    dispatch(modalActions.openForgotPasswordModal());
  };

  return (
    <div>
      <Card className="w-full p-8">
        <form onSubmit={loginHandler} className="w-full" autoComplete="off">
          <div className="flex items-center justify-between mb-4 pb-4">
            {" "}
            <div className="w-[14%]">
              {" "}
              <img src={Logo} alt="logo" className="w-full h-full" />
            </div>
            <h1 className="w-full font-semibold text-2xl">Login</h1>
          </div>
          <Grid container spacing={2}>
            {isError && (
              <Grid item xs={12}>
                <p className="text-error">{errorMsg}</p>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                autoFocus
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                value={loginFormik.values.email}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                error={
                  loginFormik.touched.email && loginFormik.errors.email
                    ? true
                    : false
                }
              />{" "}
              {loginFormik.touched.email && loginFormik.errors.email && (
                <p className="text-error text-sm">{loginFormik.errors.email}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                margin="normal"
                name="password"
                label="Password"
                value={loginFormik.values.password}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                variant="outlined"
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  loginFormik.touched.password && loginFormik.errors.password
                    ? true
                    : false
                }
              />
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="text-error text-sm">
                  {loginFormik.errors.password}
                </p>
              )}
            </Grid>
          </Grid>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 1, p: 1.5 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <span
                className="text-login cursor-pointer"
                onClick={ForgotPassword}
              >
                Forgot password?
              </span>
            </Grid>
            <Grid item>
              <span className="text-black text-sm">
                Don't have an account?{" "}
                <span
                  onClick={openSignupModal}
                  className="text-login cursor-pointer"
                >
                  Sign up
                </span>
              </span>
            </Grid>
          </Grid>
        </form>
        <Button
          type="submit"
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{ mt: 3, mb: 2, p: 1.5 }}
          onClick={google}
        >
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}

export default Login;
