import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "./../Constants/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { screenActions } from "../Redux/ScreenReducer";
import { modalActions } from "../Redux/ModalReducer";
import { toast } from "react-toastify";

function ChangePassword({ openLoginModal }) {
  const user = useSelector((state) => state.login.userDetails);
  const dispatch = useDispatch();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    current_password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
    new_password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol"),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("new_password"), null],
      'Must match "new password" field value'
    ),
  });

  const signupFormik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      password_confirmation: "",
    },
    validationSchema,
  });

  const formSubmit = async (e) => {
    e.preventDefault();
    dispatch(screenActions.loadScreen());
    try {
      const data = {
        current_password: signupFormik.values.current_password,
        new_password: signupFormik.values.new_password,
      };
      console.log("data", data);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          contentType: "multipart/form-data",
        },
      };
      await axios.post(`${url}/users/changePassword/${user._id}`, data, config);
      toast("password changed successfully");
      dispatch(modalActions.closeChangePasswordModal());
    } catch (err) {
      toast("password couldn't be changed");
    }
    dispatch(screenActions.stopLoading());
  };

  return (
    <div>
      <form onSubmit={formSubmit} className="w-full" autoComplete="off">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between mb-4">
            {" "}
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <h1 className="w-full font-semibold text-2xl">Change Password</h1>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="current_password"
                label="Current Password"
                id="current_password"
                autoComplete="off"
                type={showCurrentPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={signupFormik.values.current_password}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.current_password &&
                  signupFormik.errors.current_password
                    ? true
                    : false
                }
              />{" "}
              {signupFormik.touched.current_password &&
                signupFormik.errors.current_password && (
                  <p className="text-error text-sm">
                    {signupFormik.errors.current_password}
                  </p>
                )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="new_password"
                label="New Password"
                id="new_password"
                autoComplete="off"
                type={showNewPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={signupFormik.values.new_password}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.new_password &&
                  signupFormik.errors.new_password
                    ? true
                    : false
                }
              />{" "}
              {signupFormik.touched.new_password &&
                signupFormik.errors.new_password && (
                  <p className="text-error text-sm">
                    {signupFormik.errors.new_password}
                  </p>
                )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password_confirmation"
                label="Password Confirmation"
                id="password_confirmation"
                autoComplete="off"
                type={showConfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={signupFormik.values.password_confirmation}
                onChange={signupFormik.handleChange}
                onBlur={signupFormik.handleBlur}
                error={
                  signupFormik.touched.password_confirmation &&
                  signupFormik.errors.password_confirmation
                    ? true
                    : false
                }
              />{" "}
              {signupFormik.touched.password_confirmation &&
                signupFormik.errors.password_confirmation && (
                  <p className="text-error text-sm">
                    {signupFormik.errors.password_confirmation}
                  </p>
                )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1, mb: 1, p: 1.5 }}
          >
            Confirm
          </Button>
        </Card>
      </form>
    </div>
  );
}

export default ChangePassword;
