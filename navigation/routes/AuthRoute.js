import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Registration from "../../screens/Auth/Registration";
import Login from "../../screens/Auth/Login";
import ForgotPassword from "../../screens/Auth/ForgotPassword";

const Stack = createNativeStackNavigator();
const AuthRoute = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AuthRoute;
