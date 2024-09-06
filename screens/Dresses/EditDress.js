import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RadioButton } from "react-native-paper";
import { primaryColor, styles, whiteColor } from "../../styles/style";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;
import * as ImagePicker from "expo-image-picker";

const EditDress = ({ route }) => {
  const dressId = route.params.dressId;
  const navigation = useNavigation();
  const [checked, setChecked] = useState("male");
  const [dressName, setDressName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");
  const { userToken } = useContext(AuthContext);
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
  // get Dress Detail
  const getDressData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getdressdetail/${userToken}/${dressId}`
      );
      setDressName(response.data.rows[0].dress_name);
      setChecked(response.data.rows[0].gender);
      setPrice(response.data.rows[0].dress_price);
      setImageName(response.data.rows[0].dress_image);
      setUniqueNumber(response.data.rows[0].dress_unique_number);
      setImage(response.data.rows[0].dress_image); // Set the initial image
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };

  //Pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
  };

  const handleSubmit = async () => {
    const formdata = new FormData();

    let imageobj = "";

    if (image && image.startsWith("file://")) {
      const fileType = image.substring(image.lastIndexOf(".") + 1);
      imageobj = {
        uri: image,
        name: imageName,
        type: `image/${fileType}`,
      };
      formdata.append("image", imageobj);
    } else {
      formdata.append("image", image);
    }


    formdata.append("dressName", dressName);
    formdata.append("price", price);
    formdata.append("gender", checked);
    formdata.append("dress_unique_number", uniqueNumber);

    try {
      const response = await axios.patch(
        `${PORT}/editdresses/${userToken}/${dressId}`,
        formdata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigation.navigate("addDressBodyParts", {
          dress_unique_number: uniqueNumber,
          gender: checked,
          isEdit: true,
          dressId: dressId
        });
      } else {
        console.log("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getDressData();
      getPathData();
    }, [])
  );

  return (
    <>
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
              Update Dress
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: whiteColor }}
        >
          <View style={[styles.form, { marginTop: responsiveHeight(4) }]}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Dress Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dress Name"
                value={dressName}
                onChangeText={(text) => setDressName(text)}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Dress Price"
                keyboardType="numeric"
                value={price}
                onChangeText={(text) => setPrice(text)}
              ></TextInput>
            </View>
            <View style={styles.inputfield}>
              <Text style={styles.label}>Select Gender</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="male"
                  status={checked === "male" ? "checked" : "unchecked"}
                  onPress={() => setChecked("male")}
                  color={primaryColor}
                  uncheckedColor={primaryColor}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Male
                </Text>

                <View style={{ marginLeft: 10 }}>
                  <RadioButton
                    value="female"
                    status={checked === "female" ? "checked" : "unchecked"}
                    onPress={() => setChecked("female")}
                    color={primaryColor}
                    uncheckedColor={primaryColor}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    opacity: 0.6,
                    fontSize: responsiveFontSize(2),
                    fontFamily: "Regular",
                  }}
                >
                  Female
                </Text>
              </View>
            </View>

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
                  Edit Dress Image
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputfield]}>
              <View
                style={[
                  styles.imageContainer,
                  ,
                  { width: responsiveWidth(24), height: responsiveHeight(10) },
                ]}
              >
                {/* <Image source={require("../../assets/images/kurta.png")} /> */}
                {image && image.startsWith("file://") ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: "90%", height: "90%" }}
                  />
                ) : image === "NoImage.jpg" ? (
                  <Image
                    source={require('../../assets/images/NoImage.jpg')}
                    style={{ width: "90%", height: "90%" }}
                  />
                ) : (
                  <Image
                    source={{ uri: `${pathData}/uploads/dresses/${image}` }}
                    style={{ width: "90%", height: "90%" }}
                  />
                )}
              </View>
            </View>
            <View style={{ marginTop: responsiveHeight(12) }}>
              <TouchableOpacity style={styles.onlybtn} onPress={handleSubmit}>
                <Text style={styles.onlybtntext}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditDress;