import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../Constants/Url";
import { Button, Card, Grid, TextField, Avatar } from "@mui/material";
import { errorCodes } from "../Constants/ErrorCodes";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { screenActions } from "../Redux/ScreenReducer";
import { modalActions } from "../Redux/ModalReducer";
import Logo from "./../Images/bulb.png";

import { toast } from "react-toastify";

const ContactUs = () => {
  const dispatch = useDispatch();
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitContactUs = async (e) => {
    e.preventDefault();
    setError(false);
    dispatch(screenActions.loadScreen());
    try {
      await axios.post(`${url}/contacts`, {
        email,
        message,
      });
      toast("Message sent successfully");
      dispatch(modalActions.closeContactUsModal());
    } catch (err) {
      setError(true);
      const error = err?.response?.status;
      setErrorMsg(errorCodes?.[error] || "Something went wrong");
    }
    dispatch(screenActions.stopLoading());
  };

  return (
    <div className="">
      <form className="w-full" onSubmit={submitContactUs} autoComplete="off">
        <Card className="w-full p-8">
          <div className="flex items-center justify-between mb-4">
            {" "}
            <div className="w-[14%]">
              {" "}
              <img src={Logo} alt="logo" className="w-full h-full" />
            </div>
            <h1 className="w-full font-semibold text-2xl">Contact Us</h1>
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
                name="email"
                label="Enter your email"
                autoComplete="off"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="message"
                label="Your message"
                autoComplete="off"
                type="text"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1, mb: 1, p: 1.5 }}
          >
            Send
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default ContactUs;
