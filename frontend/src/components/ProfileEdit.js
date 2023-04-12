import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import axios from "axios";
import { url } from "./../Constants/Url";
import { modalActions } from "../Redux/ModalReducer";
import { loginActions } from "../Redux/LoginReducer";
import Avatar from "./../Images/avatar.png";
import { toast } from "react-toastify";

function ProfileEdit({ userProfile, type, activeStep, changeStep, getUser }) {
  const [images, setImages] = useState();
  const [imgPreviews, setImgPreviews] = useState(Avatar);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    setImages(userProfile?.user_image);
    setImgPreviews(
      `http://localhost:5000/static/users/${userProfile?.user_image}` || Avatar
    );
  }, []);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    onPreviews(file);
  };

  const onPreviews = (file) => {
    setImgPreviews(URL.createObjectURL(file));
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Name is Required"),
    qualification: Yup.string().required("Academic qualification is Required"),
    phone_number: Yup.number(),
    address: Yup.string(),
    experience: Yup.number(),
  });

  const profileFormik = useFormik({
    initialValues: {
      fullName: userProfile?.full_name || "",
      qualification: userProfile?.qualification || "",
      experience: userProfile?.experience || "",
      phone_number: userProfile?.phone_number || "",
      address: userProfile?.address || "",
      bio: userProfile?.bio || "",
    },
    validationSchema,
    onSubmit: (data) => {
      console.log("submitted", data);
    },
  });

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("full_name", profileFormik.values.fullName);
      formData.append("qualification", profileFormik.values.qualification);
      formData.append("phone_number", profileFormik.values.phone_number);
      formData.append("address", profileFormik.values.address);
      formData.append("bio", profileFormik.values.bio);
      formData.append("user_image", images);

      formData.forEach((field, value) => console.log(field, value));

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          contentType: "multipart/form-data",
        },
      };
      const response = await axios.put(
        `${url}/users/${userProfile._id}`,
        formData,
        config
      );
      dispatch(modalActions.closeEditProfileModal());
      dispatch(loginActions.updateUser(response?.data?.data?.user));
      getUser();
      toast("Profile updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleStep = (e) => {
    e.preventDefault();
    let data = profileFormik.values;
    data.user_image = images;
    dispatch(loginActions.updateTeacher(data));
    return changeStep(activeStep + 1);
  };

  return (
    <div>
      <form
        onSubmit={type === "teacher" ? handleStep : formSubmit}
        autoComplete="off"
      >
        <Card className="w-full px-12">
          {type !== "teacher" && (
            <h1 className="w-full text-center font-semibold text-2xl pt-2">
              Update Your Profile
            </h1>
          )}
          <div className="flex items-center justify-center py-2">
            <div className="w-24 h-24 rounded-full bg-primary relative">
              <input
                type="file"
                required={type === "teacher" ? true : false}
                onChange={onImageChange}
                className="z-0 w-full h-full absolute top-0 left-0 opacity-0"
              />
              <img
                src={imgPreviews}
                alt="img"
                className="h-full w-full rounded-full"
              />
            </div>
          </div>
          <Grid container spacing={3}>
            {type !== "teacher" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  required
                  value={profileFormik.values.fullName}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                  variant="outlined"
                  error={
                    profileFormik.touched.fullName &&
                    profileFormik.errors.fullName
                      ? true
                      : false
                  }
                />
                {profileFormik.touched.fullName &&
                  profileFormik.errors.fullName && (
                    <p className="text-error text-md">
                      {profileFormik.errors.fullName}
                    </p>
                  )}
              </Grid>
            )}
            {type === "teacher" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="qualification"
                  label="Academic Qualification"
                  required
                  value={profileFormik.values.qualification}
                  onChange={profileFormik.handleChange}
                  variant="outlined"
                  error={
                    profileFormik.touched.qualification &&
                    profileFormik.errors.qualification
                      ? true
                      : false
                  }
                />
                {profileFormik.touched.qualification &&
                  profileFormik.errors.qualification && (
                    <p className="text-error text-md">
                      {profileFormik.errors.qualification}
                    </p>
                  )}
              </Grid>
            )}
            {type === "teacher" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  name="experience"
                  label="Teaching Experience (in years)"
                  required
                  value={profileFormik.values.experience}
                  onChange={profileFormik.handleChange}
                  variant="outlined"
                  error={
                    profileFormik.touched.experience &&
                    profileFormik.errors.experience
                      ? true
                      : false
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone_number"
                label="Phone Number"
                value={profileFormik.values.phone_number}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                variant="outlined"
                error={
                  profileFormik.touched.phone_number &&
                  profileFormik.errors.phone_number
                    ? true
                    : false
                }
              />
              {profileFormik.touched.phone_number &&
                profileFormik.errors.phone_number && (
                  <p className="text-error text-md">
                    {profileFormik.errors.phone_number}
                  </p>
                )}
            </Grid>
            {!activeStep && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={profileFormik.values.address}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                  variant="outlined"
                  error={
                    profileFormik.touched.address &&
                    profileFormik.errors.address
                      ? true
                      : false
                  }
                />
                {profileFormik.touched.address &&
                  profileFormik.errors.address && (
                    <p className="text-error text-md">
                      {profileFormik.errors.address}
                    </p>
                  )}
              </Grid>
            )}
            {!activeStep && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="bio"
                  multiline
                  rows={4}
                  label="Something about yourself.."
                  value={profileFormik.values.bio}
                  onChange={profileFormik.handleChange}
                  variant="outlined"
                />
              </Grid>
            )}
            <Grid item xs={12} className="flex justify-between">
              {/* {type === "teacher" && !isLoggedIn && (
                <Button
                  // onClick={changeStep(activeStep - 1)}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2, mb: 2, p: 1.5, mr: 2 }}
                >
                  Prev{" "}
                </Button>
              )} */}
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                sx={{ mt: 2, mb: 2, p: 1.5 }}
              >
                {type === "teacher" ? "Next" : "Update"}
              </Button>
            </Grid>
          </Grid>
        </Card>
      </form>
    </div>
  );
}

export default ProfileEdit;
