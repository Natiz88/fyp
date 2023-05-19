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

const AddGift = () => {
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [gift, setgift] = useState([]);
  const { id } = useParams();
  const [isgiftAdded, setgiftAdded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
      console.log("re", response);
      setgift(response?.data?.data?.gifts);
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
    const body = { ...signupFormik.values };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        contentType: "multipart/form-data",
      },
    };
    try {
      await axios.put(`${url}/gifts/${gift?._id}`, body, config);
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
    const body = signupFormik.values;
    try {
      await axios.post(`${url}/gifts`, body, config);
      giftAddedSuccess("The gift was added");
    } catch (err) {
      giftAddedError(err);
    }
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
