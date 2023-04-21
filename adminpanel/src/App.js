import React, { lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { LoginContext } from "./context/LoginContext";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

function App() {
  const { user, isLoggedIn } = useContext(LoginContext);
  console.log("user", user);
  console.log("log", isLoggedIn);
  return (
    <>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/app" component={Layout} />
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
