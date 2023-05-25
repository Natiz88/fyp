import React from "react";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
import { Link, useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { TailSpin } from "react-loading-icons";
import { Input, Textarea, Label, Button, Modal } from "@windmill/react-ui";
import { url } from "../../utils/URL";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import GiftImage from "./../../assets/img/gift.PNG";

const AddGift = () => {
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [gift, setgift] = useState([]);
  const { id } = useParams();
  const [isgiftAdded, setgiftAdded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [giftImage, setGiftImage] = useState();
  const [imgPreview, setImgPreview] = useState(GiftImage);

  const history = useHistory();
  useEffect(() => {
    if (parseInt(id) > 0) {
      setEditMode(true);
      getgift();
    }
  }, []);

  const getgift = async () => {
    try {
      const response = await axios.get(`${url}/gifts/${id}`);
      setImgPreview(
        `http://localhost:5000/static/gifts/${response?.data?.data?.gift?.gift_image}`
      );
      setgift(response?.data?.data?.gift);
    } catch (err) {
      console.log(err);
    }
  };

  // const validationSchema = Yup.object({
  //   full_name: Yup.string()
  //     .matches(/^[A-Za-z ]*$/, "Please enter valid name")
  //     .max(50),
  //   email: Yup.string().email("please enter valid email"),
  //   password: Yup.string()
  //     .min(8, "Password must be 8 characters long")
  //     .matches(/[0-9]/, "Password requires a number")
  //     .matches(/[a-z]/, "Password requires a lowercase letter")
  //     .matches(/[A-Z]/, "Password requires an uppercase letter")
  //     .matches(/[^\w]/, "Password requires a symbol"),
  // });

  const signupFormik = useFormik({
    enableReinitialize: "true",
    initialValues: {
      gift_name: gift?.gift_name || "",
      gift_price: gift?.gift_price || 0,
    },
    onSubmit: (data) => {
      console.log("submitted", data);
    },
  });

  const giftAddedSuccess = (message) => {
    setTimeout(() => {
      setgiftAdded(false);
      history.push("/app/gifts");
    }, 1000);
    setModalMessage(message);
    setgiftAdded(true);
  };
  const giftAddedError = (err) => {
    setTimeout(() => {
      setgiftAdded(false);
      return;
    }, 1000);
    console.log(err);
    setModalMessage(err.response.data.message);
    setgiftAdded(true);
  };

  const updategift = async (e) => {
    e.preventDefault();
    setError(false);
    const body = { ...signupFormik.values, gift_image: giftImage };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        contentType: "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.append("gift_name", signupFormik.values.gift_name);
    formData.append("gift_price", signupFormik.values.gift_price);
    formData.append("gift_image", giftImage);
    try {
      await axios.put(`${url}/gifts/${gift?._id}`, formData, config);
      giftAddedSuccess("The gift was updated");
    } catch (err) {
      giftAddedError(err);
    }
  };
  const addgift = async (e) => {
    e.preventDefault();
    setError(false);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        contentType: "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.append("gift_name", signupFormik.values.gift_name);
    formData.append("gift_price", signupFormik.values.gift_price);
    formData.append("gift_image", giftImage);
    try {
      await axios.post(`${url}/gifts`, formData, config);
      console.log("success");
      giftAddedSuccess("The gift was added");
    } catch (err) {
      giftAddedError(err);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setGiftImage(file);
    onPreviews(file);
  };

  const onPreviews = (file) => {
    setImgPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <PageTitle>{editMode ? "Edit" : "Add"} Gift</PageTitle>
      {id > 0 && gift.length <= 0 ? (
        <div className="mt-10 m-auto flex justify-center">
          <TailSpin stroke="black" width="200" height="50" />
        </div>
      ) : (
        <>
          <form
            onSubmit={id < 0 ? addgift : updategift}
            className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
            {isError && <h1 className="text-red-500 my-3">{errorMessage}</h1>}

            {/* <div className="py-4 relative bg-green-400">
              <div className="w-full h-full">
                <span>Gift Image</span>
                <img
                  src={
                    imgPreview
                    // gift?.gift_image
                    //   ? `http://localhost:5000/static/gifts/${gift?.gift_image}`
                    //   : GiftImage
                  }
                  width={150}
                  height={150}
                />
              </div>
              <input type="file" onChange={onImageChange} />
              {/* <div className="absolute w-full h-full -z-1 bg-yellow-200">
                <input className="w-full h-full" type="img" />
              </div> */}

            <div className="flex py-2">
              <div className="w-50 h-40 rounded-full bg-primary relative">
                <input
                  type="file"
                  required={id < 0 ? true : false}
                  onChange={onImageChange}
                  className="z-0 w-full h-full absolute top-0 left-0 opacity-0"
                />
                <img src={imgPreview} alt="img" className="h-full w-full " />
              </div>
            </div>

            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                name="gift_name"
                value={signupFormik.values.gift_name}
                required
                onChange={signupFormik.handleChange}
              />
            </Label>
            <Label className="mt-5">
              <span>Price</span>
              <Textarea
                className="mt-1"
                name="gift_price"
                type="text"
                value={signupFormik.values.gift_price}
                onChange={signupFormik.handleChange}
              />
            </Label>

            <Button type="submit" className="m-auto mt-4">
              {id < 0 ? "Add" : "Update"} gift
            </Button>
          </form>
        </>
      )}
      <Modal isOpen={isgiftAdded}>{modalMessage}</Modal>
    </div>
  );
};

export default AddGift;
