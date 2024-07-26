import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useReducer, useMemo, createContext, useEffect } from "react";

const initialLoginState = {
  isLoading: true,
  userToken: null,
};

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...prevState,
        userToken: null,
        isLoading: false,
      };
    case "REGISTER":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    default:
      return prevState;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  useEffect(() => {
    const loadToken = async () => {
      let userToken;
      userToken = null;

      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    };

    loadToken();
  }, []);

  const authContext = useMemo(
    () => ({
      signin: async (id) => {
        let userToken = String(id);
        try {
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", token: userToken });
      },
      signout: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      userToken: loginState.userToken,
      isLoading: loginState.isLoading,
    }),
    [loginState]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
