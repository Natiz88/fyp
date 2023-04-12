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

function AddFaq() {
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [faq, setfaq] = useState([]);
  const { id } = useParams();
  const [isfaqAdded, setfaqAdded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const history = useHistory();
  useEffect(() => {
    if (parseInt(id) > 0) {
      setEditMode(true);
      getfaq();
    }
  }, []);

  const getfaq = async () => {
    try {
      const response = await axios.get(`${url}/faqs/${id}`);
      console.log("re", response);
      setfaq(response?.data?.data?.FAQs);
    } catch (err) {
      console.log(err);
    }
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
    enableReinitialize: "true",
    initialValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
    },
    validationSchema,
    onSubmit: (data) => {
      console.log("submitted", data);
    },
  });

  const faqAddedSuccess = (message) => {
    setTimeout(() => {
      setfaqAdded(false);
      history.push("/app/faqs");
    }, 1000);
    setModalMessage(message);
    setfaqAdded(true);
  };
  const faqAddedError = (err) => {
    setTimeout(() => {
      setfaqAdded(false);
      return;
    }, 1000);
    console.log(err);
    setModalMessage(err.response.data.message);
    setfaqAdded(true);
  };
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
      contentType: "multipart/form-data",
    },
  };
  const updatefaq = async (e) => {
    e.preventDefault();
    setError(false);
    const body = { ...signupFormik.values };
    try {
      await axios.put(`${url}/faq/${faq?._id}`, body, config);
      faqAddedSuccess("The faq was updated");
    } catch (err) {
      faqAddedError(err);
    }
  };
  const addfaq = async (e) => {
    e.preventDefault();
    setError(false);
    const body = signupFormik.values;
    try {
      await axios.post(`${url}/faq`, body, config);
      faqAddedSuccess("The faq was added");
    } catch (err) {
      faqAddedError(err);
    }
  };

  return (
    <div>
      <PageTitle>{editMode ? "Edit" : "Add"} FAQ</PageTitle>
      {id > 0 && faq.length <= 0 ? (
        <div className="mt-10 m-auto flex justify-center">
          <TailSpin stroke="black" width="200" height="50" />
        </div>
      ) : (
        <>
          <form
            onSubmit={id < 0 ? addfaq : updatefaq}
            className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
            {isError && <h1 className="text-red-500 my-3">{errorMessage}</h1>}

            <Label>
              <span>Question</span>
              <Input
                className="mt-1"
                name="question"
                value={signupFormik.values.question}
                required
                onChange={signupFormik.handleChange}
              />
            </Label>
            <Label className="mt-5">
              <span>Answer</span>
              <Textarea
                className="mt-1"
                name="answer"
                type="text"
                value={signupFormik.values.answer}
                onChange={signupFormik.handleChange}
              />
            </Label>

            <Button type="submit" className="m-auto mt-4">
              {id < 0 ? "Add" : "Update"} faq
            </Button>
          </form>
        </>
      )}
      <Modal isOpen={isfaqAdded}>{modalMessage}</Modal>
    </div>
  );
}

export default AddFaq;