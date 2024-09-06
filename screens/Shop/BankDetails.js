import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  Alert,
  ScrollView
} from "react-native";
import { styles, whiteColor } from "../../styles/style";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const BankDetails = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [addBankDetail, setAddBankDetail] = useState({
    bank_name: "",
    ac_no: "",
    ifsc_code: "",
    image: null,
  });
  const [bankDetails, setBankDetails] = useState([]);
  const [editBankDetail, setEditBankDetail] = useState({
    bank_name: "",
    ac_no: "",
    ifsc_code: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [newImageName, setNewImageName] = useState("");
  const [imageName, setImageName] = useState("");


  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission Denied', 'We need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };
  const [pathData, setPathData] = useState([]);
  const getPathData = async () => {
    await axios
      .get(`${PORT}/getpathesdata`)
      .then((res) => {
        setPathData(res.data.rows[0].image_path);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setAddBankDetail((prevData) => ({
        ...prevData,
        image: result.assets[0].uri,
      }));
      setImageName(result.assets[0].fileName);
    }
  };

  const pickEditImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
      setNewImageName(result.assets[0].fileName);
    }
  };

  const handleChange = (name, value) => {
    setAddBankDetail((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formdata = new FormData();

    const fileType = addBankDetail.image.substring(addBankDetail.image.lastIndexOf(".") + 1);
    const imageobj = {
      uri: addBankDetail.image,
      name: imageName,
      type: `image/${fileType}`,
    };
    formdata.append("bank_name", addBankDetail.bank_name);
    formdata.append("ac_no", addBankDetail.ac_no);
    formdata.append("ifsc_code", addBankDetail.ifsc_code);
    formdata.append("image", imageobj);

    try {
      const response = await axios.post(
        `${PORT}/addbankdetails/${userToken}`,
        formdata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        navigation.navigate("Homepage");
      } else {
        Alert.alert("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error + "error in adding bank details ");
    }
  };

  const getBankData = async () => {
    try {
      const response = await axios.get(`${PORT}/getallbankdata/${userToken}`);
      const bankdata = response.data.rows;
      setBankDetails(bankdata);
      if (bankdata.length > 0) {
        setEditBankDetail({
          bank_name: bankdata[0].bank_name,
          ac_no: bankdata[0].ac_no,
          ifsc_code: bankdata[0].ifsc_code,
        });
      }
    } catch (error) {
      console.error(error + "error in getting bank data");
    }
  };

  const handleEditChange = (name, value) => {
    setEditBankDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const formdata = new FormData();

    let imageobj = "";
    if (newImage && newImage.startsWith("file://")) {
      const fileType = newImage.substring(newImage.lastIndexOf(".") + 1);
      imageobj = {
        uri: newImage,
        name: newImageName,
        type: `image/${fileType}`,
      };
      formdata.append("image", imageobj);
    } else {
      formdata.append("image", bankDetails[0].image);
    }

    formdata.append("bank_name", editBankDetail.bank_name);
    formdata.append("ac_no", editBankDetail.ac_no);
    formdata.append("ifsc_code", editBankDetail.ifsc_code);

    try {
      const response = await axios.patch(
        `${PORT}/editbankdetails/${userToken}`,
        formdata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigation.navigate("Homepage");
      } else {
        Alert.alert("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBankData();
    getPathData();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
      <View style={[styles.headerwithline, { flexDirection: "row" }]}>
        <View style={{ width: responsiveWidth(12) }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back"
              size={23}
              color="black"
              style={{
                alignSelf: "center",
                marginHorizontal: responsiveWidth(1),
                marginTop: responsiveHeight(0.4),
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: responsiveWidth(80) }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: responsiveFontSize(2.5),
              fontFamily: "Medium",
            }}
          >
            Bank Details
          </Text>
        </View>
      </View>
      <View style={styles.line70}></View>

      <ScrollView>
        {bankDetails.length === 0 ? (
          <View style={styles.flatlistheader}>
            <View style={styles.inputfield}>
              <TouchableOpacity
                style={styles.dressfileSelect}
                onPress={pickImage}
              >
                <Text style={styles.dressfileSelecttext}>
                  <Ionicons name="add-outline" size={16} />
                </Text>
                <Text
                  style={[
                    styles.dressfileSelecttext,
                    { marginTop: responsiveHeight(0.5) },
                  ]}
                >
                  Add QR Code
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputfield,
                { width: responsiveWidth(24), height: responsiveHeight(10) },
              ]}
            >
              {
                addBankDetail.image == null ? (
                  ""
                ) : (
                  <View
                    style={[
                      styles.imageContainer,
                      {
                        width: responsiveWidth(24),
                        height: responsiveHeight(10),
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: addBankDetail.image }}
                      style={{ width: "90%", height: "90%", borderRadius: 3 }}
                    />
                  </View>
                )
              }
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Bank Name"
                value={addBankDetail.bank_name}
                onChangeText={(text) => handleChange("bank_name", text)}
              />
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Account Number"
                value={addBankDetail.ac_no}
                onChangeText={(text) => handleChange("ac_no", text)}
              />
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your IFSC Code"
                value={addBankDetail.ifsc_code}
                onChangeText={(text) => handleChange("ifsc_code", text)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.flatlistheader}>
            <View style={styles.inputfield}>
              <TouchableOpacity
                style={styles.dressfileSelect}
                onPress={pickEditImage}
              >
                <Text style={styles.dressfileSelecttext}>
                  <Ionicons name="pencil-outline" size={16} />
                </Text>
                <Text
                  style={[
                    styles.dressfileSelecttext,
                    { marginTop: responsiveHeight(0.5), marginLeft: responsiveWidth(2) },
                  ]}
                >
                  Edit QR Code
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputfield,
                { width: responsiveWidth(24), height: responsiveHeight(10) },
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  {
                    width: responsiveWidth(24),
                    height: responsiveHeight(10),
                  },
                ]}
              >
                {newImage && newImage.startsWith("file://") ? (
                  <Image source={{ uri: newImage }} style={{ width: "90%", height: "90%", borderRadius: 3 }} />
                ) : (
                  <Image
                    source={{ uri: `${pathData}/uploads/bank/${bankDetails[0].image}` }}
                    style={{ width: "90%", height: "90%", borderRadius: 3 }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Bank Name"
                value={editBankDetail.bank_name}
                onChangeText={(text) => handleEditChange("bank_name", text)}
              />
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Account Number"
                value={editBankDetail.ac_no}
                onChangeText={(text) => handleEditChange("ac_no", text)}
              />
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your IFSC Code"
                value={editBankDetail.ifsc_code}
                onChangeText={(text) => handleEditChange("ifsc_code", text)}
              />
            </View>
          </View>
        )}
        <View
          style={{
            marginHorizontal: responsiveWidth(8),
            marginTop: responsiveHeight(8),
            width: "83%",
          }}
        >
          <TouchableOpacity
            style={styles.onlybtn}
            onPress={bankDetails.length === 0 ? handleSubmit : handleUpdate}
          >
            <Text style={styles.onlybtntext}>
              {bankDetails.length === 0 ? "Save" : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default BankDetails;
