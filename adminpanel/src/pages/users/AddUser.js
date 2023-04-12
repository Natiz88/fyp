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

function AddUser() {
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState([]);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [isPasswordSame, setPasswordSame] = useState(false);
  const [user_image, setUserImage] = useState("");
  const [isUserAdded, setUserAdded] = useState(false);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState([]);
  const [password, setPassword] = useState("");
  const [user_role, setUserRole] = useState("student");
  const [editMode, setEditMode] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const history = useHistory();
  useEffect(() => {
    if (parseInt(id) > 0) {
      setEditMode(true);
      getUser();
    }
  }, []);

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
      full_name: user?.full_name || "",
      email: user?.email || "",
      password: "",
      bio: user?.bio || "",
      address: user?.address || "",
      phone_number: user?.phone_number || "",
    },
    validationSchema,
    onSubmit: (data) => {
      console.log("submitted", data);
    },
  });

  const getUser = async () => {
    try {
      const response = await axios.get(`${url}/users/${id}`);
      setUser(response?.data?.data?.user);
      setUserImage(response?.data?.data?.user?.user_image);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRadioRole = (e) => {
    setUserRole(e.target.value);
  };

  const userAddedSuccess = (message) => {
    setTimeout(() => {
      setUserAdded(false);
      history.push("/app/users");
    }, 10000);
    setModalMessage(message);
    setUserAdded(true);
  };
  const userAddedError = (err) => {
    setTimeout(() => {
      setUserAdded(false);
      return;
    }, 1000);
    console.log(err);
    setModalMessage(err.response.data.message);
    setUserAdded(true);
  };
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
      contentType: "multipart/form-data",
    },
  };
  const updateUser = async (e) => {
    e.preventDefault();
    setError(false);
    const body = { ...signupFormik.values };
    try {
      await axios.put(`${url}/users/${user?._id}`, body, config);
      userAddedSuccess("The user was updated");
    } catch (err) {
      userAddedError(err);
    }
  };
  const addUser = async (e) => {
    e.preventDefault();
    setError(false);
    const body = { ...signupFormik.values, user_role };
    console.log("body", body);
    try {
      await axios.post(`${url}/users/signup`, body);
      userAddedSuccess("The user was added");
    } catch (err) {
      userAddedError(err);
    }
  };
  console.log(user_image);

  return (
    <div>
      <PageTitle>User Details</PageTitle>
      {id > 0 && user.length <= 0 ? (
        <div className="mt-10 m-auto flex justify-center">
          <TailSpin stroke="black" width="200" height="50" />
        </div>
      ) : (
        <>
          <form
            onSubmit={id < 0 ? addUser : updateUser}
            className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
            <Label>
              <span>Full Name</span>
              <Input
                className="mt-1"
                name="full_name"
                value={signupFormik.values.full_name}
                required
                placeholder="Jane Doe"
                onChange={signupFormik.handleChange}
              />
            </Label>
            <Label className="mt-5">
              <span>Email</span>
              <Input
                className="mt-1"
                name="email"
                type="email"
                disabled={editMode}
                value={signupFormik.values.email}
                placeholder="xyz@gmail.com"
                onChange={signupFormik.handleChange}
              />
            </Label>
            {!editMode && (
              <Label className="mt-5">
                <span>Password</span>
                <Input
                  name="password"
                  className="mt-1"
                  type="password"
                  placeholder="********"
                  value={signupFormik.values.password}
                  onChange={signupFormik.handleChange}
                />
              </Label>
            )}
            {editMode && (
              <>
                <div className="mt-4">
                  <Label>User Role</Label>
                  <Label radio>
                    <Input
                      type="radio"
                      value="admin"
                      name="userRole"
                      onChange={handleRadioRole}
                      checked={user_role === "admin" ? true : false}
                    />
                    <span className="ml-2">Admin</span>
                  </Label>
                  <Label className="ml-6" radio>
                    <Input
                      type="radio"
                      value="student"
                      name="userRole"
                      onChange={handleRadioRole}
                      checked={user_role == "student" ? true : false}
                    />
                    <span className="ml-2">Student</span>
                  </Label>
                  <Label className="ml-6" radio>
                    <Input
                      type="radio"
                      value="teacher"
                      name="userRole"
                      onChange={handleRadioRole}
                      checked={user_role == "teacher" ? true : false}
                    />
                    <span className="ml-2">Teacher</span>
                  </Label>
                </div>

                <div className="py-4">
                  <span>User Image</span>
                  <img
                    src={`http://localhost:5000/static/users/${user_image}`}
                    className="w-20 h-20 rounded-full "
                  />
                </div>
                <Label className="mt-5">
                  <span>Bio</span>
                  <Textarea
                    name="bio"
                    className="mt-1"
                    type="number"
                    value={signupFormik.values.bio}
                    onChange={signupFormik.handleChange}
                  />
                </Label>
                <Label className="mt-5">
                  <span>Address</span>
                  <Input
                    className="mt-1"
                    name="address"
                    value={signupFormik.values.address}
                    onChange={signupFormik.handleChange}
                  />
                </Label>

                <Label className="mt-5">
                  <span className="mt-5">Contact</span>
                  <Input
                    className="mt-1"
                    name="phone_number"
                    value={signupFormik.values.phone_number}
                    onChange={signupFormik.handleChange}
                  />
                </Label>
              </>
            )}
            {isError && <h1 className="text-red-500 my-3">{errorMessage}</h1>}
            <Button type="submit" className="m-auto mt-4">
              {id < 0 ? "Add" : "Update"} User
            </Button>
          </form>
        </>
      )}
      <Modal isOpen={isUserAdded}>{modalMessage}</Modal>
    </div>
  );
}

export default AddUser;
