import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../Redux/LoginReducer";
import { modalActions } from "../Redux/ModalReducer";
import IdCard from "./../Images/id.jfif";
import { Button } from "@mui/material";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { url } from "./../Constants/Url";

const UploadDocuments = (activeStep, changeStep) => {
  const [id, setId] = useState();
  const [imgPreviews, setImgPreviews] = useState(IdCard);
  const dispatch = useDispatch();
  const teacherSignup = useSelector((state) => state.login.teacherSignup);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setId(file);
    onPreviews(file);
  };

  const onPreviews = (file) => {
    setImgPreviews(URL.createObjectURL(file));
  };

  const openLoginModal = () => {
    dispatch(modalActions.closeTeacherModal());
    dispatch(modalActions.openLoginModal());
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // for (const [key, value] of Object.entries(teacherSignup)) {
    //   formData.append(key, value);
    // }
    // formData.append("id_photo", id);
    formData.append("email", teacherSignup.email);

    formData.append("full_name", teacherSignup.full_name);
    formData.append("qualification", teacherSignup.qualification);
    formData.append("password", teacherSignup.password);
    formData.append("phone_number", teacherSignup.phone_number);
    formData.append("address", teacherSignup.address);
    formData.append("bio", teacherSignup.bio);
    formData.append("user_image", teacherSignup.user_image);
    formData.append("id_photo", id);

    formData.forEach((x, y) => console.log(x, y));

    const config = {
      headers: {
        accept: "application/json",
        contentType: "multipart/form-data",
      },
    };

    try {
      await axios.post(`${url}/users/teacherSignup`, formData, config);
      dispatch(
        modalActions.setCredentials({
          email: teacherSignup.email,
          password: teacherSignup.password,
        })
      );
      openLoginModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="">
        <Card className="w-full px-12">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="flex items-center justify-center py-2">
                <label className="font-semibold text-base pr-4">Id card</label>

                <div className="w-48 h-24 bg-primary relative">
                  <input
                    type="file"
                    required
                    onChange={onImageChange}
                    className="z-0 w-full h-full absolute top-0 left-0 opacity-0"
                  />
                  <img src={imgPreviews} alt="img" className="h-full w-full" />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="qualification"
                label="Card Number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                sx={{ mt: 2, mb: 2, p: 1.5 }}
                type="submit"
                variant="outlined"
                className="py-4 my-8"
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </Card>
      </form>
    </div>
  );
};

export default UploadDocuments;
