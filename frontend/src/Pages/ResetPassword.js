import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../Constants/Url";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { errorCodes } from "../Constants/ErrorCodes";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { screenActions } from "../Redux/ScreenReducer";
import { modalActions } from "../Redux/ModalReducer";
import { loginActions } from "../Redux/LoginReducer";

import { toast } from "react-toastify";

const ResetPassword = ({ id, token }) => {
  const dispatch = useDispatch();
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const openLoginModal = () => {
    dispatch(modalActions.closeResetPasswordModal());
    dispatch(modalActions.openLoginModal());
    dispatch(loginActions.logout());
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setError(false);
    console.log("tok", id, token);

    if (new_password !== passwordConfirmation) {
      setError(true);
      setErrorMsg("Passwords do not Match");
      return;
    }
    dispatch(screenActions.loadScreen());
    try {
      const response = await axios.post(`${url}/users/newpassword`, {
        new_password,
        id,
        token,
      });
      toast("Password reset successfull");
      dispatch(
        modalActions.setCredentials({
          email: response?.data?.data?.user?.email,
          password: new_password,
        })
      );
      openLoginModal();
    } catch (err) {
      setError(true);
      const error = err?.response?.status;
      if (error === 400) {
        setErrorMsg("The link is not valid");
      } else {
        setErrorMsg(errorCodes?.[error] || "Something went wrong");
      }
    }
    dispatch(screenActions.stopLoading());
  };

  return (
    <div className="">
      <form className="w-full" onSubmit={submitPassword} autoComplete="off">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between mb-4">
            {" "}
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <h1 className="w-full font-semibold text-2xl">Reset Password</h1>
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
                name="new_password"
                label="Enter New Password"
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
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="passwordConfirmation"
                label="Re Enter New Password"
                autoComplete="off"
                type={showPasswordConfirmation ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(!showPasswordConfirmation)
                        }
                      >
                        {showPasswordConfirmation ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
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
};

export default ResetPassword;
