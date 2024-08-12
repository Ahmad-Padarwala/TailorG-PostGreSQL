
import React, { forwardRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./navigation/Index";
import { AuthProvider } from "./middleware/AuthReducer";
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Index />
        <Toast forwardRef={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </AuthProvider>
  );
}

