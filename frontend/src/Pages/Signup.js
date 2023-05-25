import React, { useState } from "react";
import { url } from "./../Constants/Url";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { errorCodes } from "../Constants/ErrorCodes";
import {
  Button,
  Card,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { modalActions } from "../Redux/ModalReducer";
import { screenActions } from "../Redux/ScreenReducer";
import { loginActions } from "../Redux/LoginReducer";

function Signup({ type, activeStep, changeStep }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openLoginModal = () => {
    dispatch(modalActions.closeSignupModal());
    dispatch(modalActions.openLoginModal());
  };

  const validationSchema = Yup.object({
    full_name: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(50),
    email: Yup.string().email("please enter valid email"),
    password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
  });

  const signupFormik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (data) => {
      console.log("submitted", data);
    },
  });

  const signupHandler = async (e) => {
    e.preventDefault();
    dispatch(screenActions.loadScreen());
    try {
      const loginData = signupFormik.values;
      console.log();
      await axios.post(`${url}/users/signup`, loginData);
      dispatch(
        modalActions.setCredentials({
          email: signupFormik.values.email,
          password: signupFormik.values.password,
        })
      );
      openLoginModal();
    } catch (err) {
      setError(true);
      const error = err?.response?.status;
      if (
        err?.response?.data?.message.includes("duplicate key error collection")
      ) {
        setErrorMsg("User already exists");
      } else {
        setErrorMsg(errorCodes?.[error] || "Something went wrong");
      }
    }
    dispatch(screenActions.stopLoading());
  };
  const stepHandler = async (e) => {
    e.preventDefault();
    console.log("for", signupFormik.values);
    setError(false);
    try {
      const email = signupFormik.values.email;
      const response = await axios.get(`${url}/users/checkEmail/${email}`);
      if (response?.data?.message === "Email already exists") {
      }
      dispatch(loginActions.updateTeacher(signupFormik.values));
      return changeStep(activeStep + 1);
    } catch (err) {
      setError(true);
      console.log("status", err.response.status);
      if (err?.response?.status === 404) {
        return setErrorMsg(err?.response?.data?.message);
      }
      setErrorMsg("Something went wrong");
    }
  };

  const google = async () => {
    window.open("http://localhost:5000/auth/google", "_self");
    // const response = await axios.get("http://localhost:5000/auth/logins");
    // console.log("log", response);
  };

  const toTeacherSignup = () => {
    dispatch(modalActions.closeSignupModal());
    navigate("/teacherSignup");
  };

  return (
    <div>
      <Card className="w-full p-8">
        <form
          onSubmit={type === "teacher" ? stepHandler : signupHandler}
          className="w-full"
          autoComplete="off"
        >
          {type !== "teacher" && (
            <div className="flex items-center justify-between mb-4">
              {" "}
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <h1 className="w-full font-semibold text-2xl">Signup</h1>
            </div>
          )}
          <Grid container spacing={2}>
            {isError && (
              <Grid item xs={12}>
                <p className="text-error">{errorMsg}</p>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="full_name"
                required
                fullWidth
                id="full_name"
                label="Full Name"
                autoFocus
                value={signupFormik.values.full_name}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.full_name &&
                  signupFormik.errors.full_name
                    ? true
                    : false
                }
              />
              {signupFormik.touched.full_name &&
                signupFormik.errors.full_name && (
                  <p className="text-error text-sm">
                    {signupFormik.errors.full_name}
                  </p>
                )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                value={signupFormik.values.email}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.email && signupFormik.errors.email
                    ? true
                    : false
                }
              />{" "}
              {signupFormik.touched.email && signupFormik.errors.email && (
                <p className="text-error text-sm">
                  {signupFormik.errors.email}
                </p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
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
                value={signupFormik.values.password}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.password && signupFormik.errors.password
                    ? true
                    : false
                }
              />{" "}
              {signupFormik.touched.password &&
                signupFormik.errors.password && (
                  <p className="text-error text-sm">
                    {signupFormik.errors.password}
                  </p>
                )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 2, p: 1.5 }}
          >
            {type === "teacher" ? "Next" : "Signup"}
          </Button>
        </form>

        <Grid container>
          <Grid item>
            {type !== "teacher" && (
              <span>
                Already have an account?
                <span
                  onClick={openLoginModal}
                  className="text-login cursor-pointer"
                >
                  Login
                </span>
              </span>
            )}
          </Grid>
        </Grid>
        {type !== "teacher" && (
          <div>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              onClick={() => {
                dispatch(modalActions.closeSignupModal());
                dispatch(modalActions.openTeacherModal());
              }}
              sx={{ mt: 3, mb: 2, p: 1.5 }}
            >
              Sign up as Teacher
            </Button>
            <Button
              type="submit"
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={google}
              sx={{ p: 1.5 }}
            >
              Continue with Google
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Signup;
