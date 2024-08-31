import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../middleware/AuthReducer";
import Onboardingroute from "./routes/OnbordingRoute";
import AuthRoute from "./routes/AuthRoute";
import BodypartsRoute from "./routes/BodypartsRoute";
import HomeStack from "./HomeStack";
import ShopProfile from "../screens/Shop/ShopProfile";
import AddCustomer from "../screens/Customer/AddCustomer";
import EditCustomer from "../screens/Customer/EditCustomer";
import ShopEditProfile from "../screens/Shop/ShopEditProfile";
import ViewCustomer from "../screens/Customer/ViewCustomer";
import AllDresses from "../screens/Dresses/AllDresses";
import AddDress from "../screens/Dresses/AddDress";
import AddDressBodyParts from "../screens/Dresses/AddDressBodyParts";
import EditDress from "../screens/Dresses/EditDress";
import ViewDress from "../screens/Dresses/ViewDress";
import EditDressBodyParts from "../screens/Dresses/EditDressBodyParts";
import Measurement from "../screens/Measurement/Measurement";
import AddMeasurement from "../screens/Measurement/AddMeasurement";
import ViewMeasurement from "../screens/Measurement/ViewMeasurement";
import EditMeasurement from "../screens/Measurement/EditMeasurement";
import ConfirmOrder from "../screens/Order/ConfirmOrder";
import CancelOrder from "../screens/Order/CancelOrder";
import AllPayments from "../screens/Payment/AllPayments";
import AddPayment from "../screens/Payment/AddPayment";
import EditPayment from "../screens/Payment/EditPayment";
import AddOrder from "../screens/Order/AddOrder";
import ViewOrder from "../screens/Order/ViewOrder";
import Order from "../screens/Order/Order";
import EditOrder from "../screens/Order/EditOrder";
import ViewPayment from "../screens/Payment/ViewPayment";
import CustomerOrder from "../screens/Order/CustomerOrder";
import BankDetails from "../screens/Shop/BankDetails";
import GeneratePdf from "../screens/Payment/GeneratePdf";
import HelpPage from "../screens/Shop/HelpPage";

const Stack = createNativeStackNavigator();

const Index = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const value = await AsyncStorage.getItem("isFirstTime");
        setIsFirstTime(value !== "1");
      } catch (error) {
        console.log("Error reading AsyncStorage", error);
      }
    };

    checkFirstTime();
  }, []);

  if (isLoading) {
    // Add a loading screen if needed
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarColor: "#000",
      }}
    >
      {userToken ? (
        <>
          <Stack.Screen name="home" component={HomeStack} />
          <Stack.Screen name="shopprofile" component={ShopProfile} />
          <Stack.Screen name="Orders" component={Order} />
          <Stack.Screen name="shopeditprofile" component={ShopEditProfile} />
          <Stack.Screen name="helpPage" component={HelpPage} />
          <Stack.Screen name="addCustomer" component={AddCustomer} />
          <Stack.Screen name="viewcustomer" component={ViewCustomer} />
          <Stack.Screen name="editcustomerprofile" component={EditCustomer} />
          <Stack.Screen name="shopDresses" component={AllDresses} />
          <Stack.Screen name="addShopDress" component={AddDress} />
          <Stack.Screen name="bodyparts" component={BodypartsRoute} />
          <Stack.Screen
            name="addDressBodyParts"
            component={AddDressBodyParts}
          />
          <Stack.Screen
            name="editDressBodyParts"
            component={EditDressBodyParts}
          />
          <Stack.Screen name="viewDress" component={ViewDress} />
          <Stack.Screen name="editDress" component={EditDress} />
          <Stack.Screen name="measurement" component={Measurement} />
          <Stack.Screen name="addMeasurement" component={AddMeasurement} />
          <Stack.Screen name="viewmeasurement" component={ViewMeasurement} />
          <Stack.Screen name="editmeasurement" component={EditMeasurement} />
          <Stack.Screen name="orderconfirmed" component={ConfirmOrder} />
          <Stack.Screen name="orderCanceled" component={CancelOrder} />
          <Stack.Screen name="allPayments" component={AllPayments} />
          <Stack.Screen name="addPayment" component={AddPayment} />
          <Stack.Screen name="editPayment" component={EditPayment} />
          <Stack.Screen name="viewPayment" component={ViewPayment} />
          <Stack.Screen name="addOrder" component={AddOrder} />
          <Stack.Screen name="viewOrder" component={ViewOrder} />
          <Stack.Screen name="customerOrder" component={CustomerOrder} />
          <Stack.Screen name="editOrder" component={EditOrder} />
          <Stack.Screen name="bankDetails" component={BankDetails} />
          <Stack.Screen name="generatePdf" component={GeneratePdf} />
        </>
      ) : (
        <>
          {isFirstTime && (
            <Stack.Screen name="Onbordingroute" component={Onboardingroute} />
          )}
          <Stack.Screen name="authroute" component={AuthRoute} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Index;
