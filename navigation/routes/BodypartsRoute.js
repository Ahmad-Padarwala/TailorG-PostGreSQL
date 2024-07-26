import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bodyparts from "../../screens/Bodyparts/Bodyparts";

const Stack = createNativeStackNavigator();
const BodypartsRoute = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen
          name="bodypartscomponent"
          component={Bodyparts}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default BodypartsRoute;
