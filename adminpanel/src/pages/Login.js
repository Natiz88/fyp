import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { GithubIcon, TwitterIcon } from "../icons";
import { Label, Input, Button } from "@windmill/react-ui";
import axios from "axios";
import { url } from "./../utils/URL";
import { LoginContext } from "../context/LoginContext";

function Login() {
  const history = useHistory();
  const { logIn } = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Couldn't send Request");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      if (email === "" || password === "") {
        setError(true);
        setErrorMessage("Please fill up the required fields");
        return;
      }
      const data = { email, password };
      const response = await axios.post(`${url}/users/adminLogin`, data);
      localStorage.setItem("token", response?.data?.token);
      logIn(response?.data?.data?.user);
      history.push("/app");
    } catch (err) {
      const status = err?.response?.status;
      setError(true);
      if (status === 404 || status === 422 || status == 401) {
        return setErrorMessage(err?.response?.data?.message || "Error");
      } else {
        console.log(err);
        setErrorMessage("Unknown Error");
      }
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form onSubmit={login} className="w-full">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              {isError && <p className="py-2 text-red-400">{errorMessage}</p>}
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@doe.com"
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="***************"
                />
              </Label>

              <Button className="mt-4" block type="submit">
                Log in
              </Button>

              <hr className="my-8" />
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
