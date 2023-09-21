import React, { useState, useCallback, useEffect } from "react";

export const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

let timeout;

//getting the remaining time for till the token is valid
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  //   console.log(adjExpirationTime);
  const remainingDuration = adjExpirationTime - currentTime;
  //   console.log(remainingDuration);

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const retrievedTokenData = retrieveStoredToken();

  let initialToken;
  if (retrievedTokenData) {
    initialToken = retrievedTokenData.token;
  }
  //   const localtoken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  const isLoggedIn = !!token;

  const login = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const timeLeft = calculateRemainingTime(expirationTime);
    timeout = setTimeout(logout, timeLeft);
  };

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    if (timeout) {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (retrievedTokenData) {
      console.log(retrievedTokenData.duration);
      timeout = setTimeout(logout, retrievedTokenData.duration);
    }
  }, [retrievedTokenData, logout]);

  const contextValue = {
    token,
    isLoggedIn,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
