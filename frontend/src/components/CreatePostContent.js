import React, { useState } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { modalActions } from "./../Redux/ModalReducer";
import { url } from "../Constants/Url";
import { errorCodes } from "../Constants/ErrorCodes";
import * as Yup from "yup";
import { Button, TextField, Card, Grid, InputAdornment } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { toast } from "react-toastify";

const CreatePostContent = () => {
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState([]);
  const [imgPreviews, setImgPreviews] = useState([]);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [isImageUploaderOpen, setImageUploaderOpen] = useState(false);
  const [isTagsOpen, setTagsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    heading: Yup.string().required(),
    body: Yup.string(),
  });

  const postFormik = useFormik({
    initialValues: {
      heading: "",
      body: "",
    },
    validationSchema,
    onSubmit: async (data) => {
      console.log(data);
    },
  });

  const onImageChange = (e) => {
    const file = e.target.files[0];
    const id = Math.random();
    setImages([...images, { id, file }]);
    onPreviews(id, file);
  };

  const onPreviews = (id, file) => {
    setImgPreviews([...imgPreviews, { id, file: URL.createObjectURL(file) }]);
  };

  const tagsHandler = () => {
    setImageUploaderOpen(false);
    setTagsOpen(!isTagsOpen);
  };

  const imageUploaderHandler = () => {
    setTagsOpen(false);
    setImageUploaderOpen(!isImageUploaderOpen);
  };

  const deleteImage = (img) => {
    setImgPreviews([...imgPreviews.filter((image) => image.id !== img.id)]);
    setImages([...images.filter((image) => image.id !== img.id)]);
  };

  const token = localStorage.getItem("token");

  const handleCreatePost = () => {
    navigate("/BrowsePosts");
    dispatch(modalActions.closePostModal());
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      let formData = new FormData();
      formData.append("question_title", postFormik.values.heading);
      formData.append("question_body", postFormik.values.body);
      tags.forEach((tag) => formData.append("question_tags", tag));
      images.forEach((image) => formData.append("question_images", image.file));
      formData.forEach((data) => console.log(data));

      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          contentType: "multipart/form-data",
        },
      };

      await axios.post(`${url}/questions`, formData, config);
      toast("the question has been posted");
      handleCreatePost();
    } catch (err) {
      console.log(err);
      setError(true);
      const error = err?.response?.status;
      toast(errorCodes[error]);
    }
  };

  return (
    <div>
      <form
        className="w-full"
        onSubmit={formHandler}
        onkeydown="return event.key != 'Enter';"
      >
        <Card className="w-full p-6">
          <h3 className="text-lg font-semibold py-4">Ask Question Here.</h3>
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
                id="heading"
                label="Enter question heading"
                name="heading"
                autoComplete="off"
                value={postFormik.values.heading}
                onChange={postFormik.handleChange}
                onBlur={postFormik.handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <h3
                className="cursor-pointer text-md font-semibold flex items-center"
                onClick={tagsHandler}
              >
                <span>Include Tags</span>
                {isTagsOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </h3>
            </Grid>
            <Grid
              item
              xs={12}
              className={`${
                isTagsOpen ? "block" : "hidden"
              } transition duration-1000 ease-in`}
            >
              <TextField
                fullWidth
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value.toLowerCase())}
                label="Enter a tag"
                // onKeyPress={(event) => {
                //   if (event.key === "Enter" && event.preventDefault()) {
                // }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SellOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <SendIcon
                        className="cursor-pointer"
                        onClick={() => {
                          if (tags.length >= 4) {
                            return;
                          }
                          setTags([...tags, tag]);
                          setTag("");
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <ul className="w-full list-none flex items-center flex-wrap">
                {tags.map((tag) => (
                  <li
                    id={tag.index}
                    className="bg-[#4392f1] rounded-md py-2 flex items-center justify-between text-white m-2 px-3"
                  >
                    {tag}
                    <CloseOutlinedIcon
                      fontSize="small"
                      className="cursor-pointer ml-2"
                      onClick={() => {
                        setTags([...tags.filter((word) => word !== tag)]);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                id="body"
                label="Enter description"
                name="body"
                autoComplete="off"
                rows={4}
                value={postFormik.values.body}
                onChange={postFormik.handleChange}
                onBlur={postFormik.handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <h3
                className="cursor-pointer text-md font-semibold flex items-center"
                onClick={imageUploaderHandler}
              >
                <span>Image Upload</span>
                {isImageUploaderOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </h3>
            </Grid>
            <Grid
              item
              xs={12}
              className={`${
                isImageUploaderOpen ? "block" : "hidden"
              } transition duration-1000 ease-in`}
            >
              <div className="w-full border-[#D3D3D3] h-[120px] border flex items-center">
                <div className=" h-3/4 mx-2 flex">
                  {imgPreviews.map((image) => (
                    <div className="w-28 mx-1 border border-[#D3D3D3] relative cursor-pointer">
                      <div
                        className="absolute top-1 right-1"
                        onClick={() => deleteImage(image)}
                      >
                        <CloseIcon />
                      </div>
                      <img alt="a" src={image.file} className="w-full h-full" />
                    </div>
                  ))}
                </div>
                {imgPreviews.length < 4 && (
                  <div className="relative w-24 h-3/4 mx-2 border-2 border-[#D3D3D3] cursor-pointer flex items-center justify-center">
                    <input
                      type="file"
                      onChange={onImageChange}
                      className="z-0 w-full h-full absolute top-0 left-0 opacity-0"
                    />
                    <ImageIcon />
                  </div>
                )}
              </div>
            </Grid>
          </Grid>

          <div className="w-full flex justify-between py-2">
            <Button
              onClick={() => dispatch(modalActions.closePostModal())}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Post
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreatePostContent;
