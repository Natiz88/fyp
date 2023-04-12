import React, { useState, useMemo } from "react";

export const LoginContext = React.createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);

  function logIn(userDetail) {
    console.log("u", userDetail);
    setLoggedIn(true);
    setUser(userDetail);
    console.log(user);
  }

  function logOut() {
    setLoggedIn(false);
  }

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      logIn,
      logOut,
    }),
    [isLoggedIn]
  );

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};
