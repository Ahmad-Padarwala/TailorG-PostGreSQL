import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  dangerColor,
  primaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const AddMeasurement = ({ route }) => {
  const navigation = useNavigation();
  const [selectedDressType, setSelectedDressType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  const { userToken } = useContext(AuthContext);
  const id = route.params.cutomerId;
  //getting dress data
  const [dressData, setDressData] = useState([]);
  const getDressData = async () => {
    try {
      const response = await axios.get(`${PORT}/getalldresses/${userToken}`, {
        params: { gender: "All" },
      });
      const customerRows = response.data.rows;
      setDressData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
    }
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
  //getting dress data
  const [measureBodyData, setMeasureBodyData] = useState([]);
  const getMeasureBodyData = async (id) => {
    try {
      const response = await axios.get(
        `${PORT}/getbodypartsinmeasure/${id}/${userToken}`
      );
      const customerRows = response.data.rows;
      setMeasureBodyData(customerRows);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");

    }
  };

  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };
  //add measurememt data
  const [addMeasure, setAddMeasure] = useState({
    name: "",
    dresses_id: null,
    customer_id: id,
    shop_id: userToken,
    created_date: new Date(),
    mea_value: [],
  });
  const handleChange = (name, value) => {
    setAddMeasure((prevProdData) => {
      return {
        ...prevProdData,
        [name]: value,
      };
    });
  };

  const handleValueChange = (index, newValue, pid) => {
    setAddMeasure((prevState) => {
      const updatedMeasurement = {
        pid,
        mea_value: newValue,
      };

      const updatedMeaValue = [
        ...prevState.mea_value.slice(0, index),
        updatedMeasurement,
        ...prevState.mea_value.slice(index + 1),
      ];

      return {
        ...prevState,
        mea_value: updatedMeaValue,
      };
    });
  };
  const handleSubmit = async () => {
    if (addMeasure.dresses_id == null) {
      alert("Please Select Dress");
      return;
    }
    if (addMeasure.name == "") {
      alert("Measurement Name Is Required");
      return;
    }
    const hasValidMeasurement = addMeasure.mea_value.some(
      (measure) => measure.mea_value && measure.mea_value.trim() !== ""
    );

    if (!hasValidMeasurement) {
      alert("At least one measurement value is required.");
      return;
    }
    try {
      const response = await axios.post(`${PORT}/addmeasureparts`, addMeasure);
      if (response.status === 200) {
        navigation.goBack();
      } else {
        console.log("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectMeaser = (index) => {
    setSelectedCardIndex(index);
  };

  const handleSelect = (item) => {
    setSelectedDressType(item);
    setAddMeasure((prevProdData) => ({
      ...prevProdData,
      dresses_id: item.id,
    }));
    getMeasureBodyData(item.id);
    setIsDropdownOpen(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getDressData();
      getPathData();
    }, [])
  );

  return (
    <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
              Add New Measurement
            </Text>
          </View>
        </View>

        <View style={styles.line70}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom: responsiveHeight(8),
          }}
        >
          <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
            <View style={styles.inputfield}>
              <Text style={styles.label}>
                Select Dress Type <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <View>
                <TouchableOpacity
                  style={styles.dressTypeSelectbutton}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedDressType ? (
                    <View style={styles.selectedItemContainer}>
                      {
                        selectedDressType.dress_image == "NoImage.jpg" ? (
                          <Image
                            source={require('../../assets/images/NoImage.jpg')}
                            style={{
                              width: responsiveWidth(8),
                              height: responsiveHeight(4),
                              borderRadius: 3,
                            }}
                          />
                        ) : (
                          <Image
                            source={{
                              uri: `${pathData}/uploads/dresses/${selectedDressType.dress_image}`,
                            }}
                            style={{
                              width: responsiveWidth(8),
                              height: responsiveHeight(4),
                              borderRadius: 3,
                            }}
                          />
                        )
                      }

                      <Text style={styles.dropdownMeaserText}>
                        {truncateString(selectedDressType.dress_name, 10)}
                      </Text>
                      <View
                        style={
                          selectedDressType.gender == "male"
                            ? styles.genderMale
                            : styles.genderFeMale
                        }
                      >
                        <Text style={styles.genderDropDownMeaserText}>
                          {selectedDressType.gender}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontFamily: "Regular",
                      }}
                    >
                      Select Dress Type
                    </Text>
                  )}
                  <Ionicons
                    name={
                      isDropdownOpen
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={22}
                    color="black"
                  />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.mainMeasermentdropdown}
                    nestedScrollEnabled={true}
                  >
                    {/* <View > */}
                    {dressData.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelect(item)}
                        style={{
                          flex: 0,
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        <View
                          style={{
                            flex: 0,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View style={styles.mainDropdownMeaserIcon}>
                            {
                              item.dress_image == "NoImage.jpg" ? (
                                <Image
                                  source={require('../../assets/images/NoImage.jpg')}
                                  style={{
                                    width: responsiveWidth(8),
                                    height: responsiveHeight(3.5),
                                    borderRadius: 3,
                                  }}
                                />
                              ) : (
                                <Image
                                  source={{
                                    uri: `${pathData}/uploads/dresses/${item.dress_image}`,
                                  }}
                                  style={{
                                    width: responsiveWidth(8),
                                    height: responsiveHeight(3.5),
                                    borderRadius: 3,
                                  }}
                                />
                              )
                            }
                          </View>
                          <View>
                            <Text style={[styles.dropdownMeaserText, { width: responsiveWidth(40) }]}>
                              {item.dress_name}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={
                            item.gender == "male"
                              ? styles.genderMale
                              : styles.genderFeMale
                          }
                        >
                          <Text style={styles.genderDropDownMeaserText}>
                            {item.gender}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {/* </View> */}
                  </ScrollView>
                )}
              </View>
            </View>

            <View style={styles.inputfield}>
              <Text style={styles.label}>
                Measurement Name <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Measurement Name"
                onChangeText={(text) => handleChange("name", text)}
              ></TextInput>
            </View>

            <View style={styles.mainMeaserContainer}>
              <Text style={styles.label}>Measurement</Text>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{
                  marginBottom: responsiveHeight(1),
                }}
              >
                <View style={styles.addMeasurementgrid}>
                  {measureBodyData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={
                        selectedCardIndex === index
                          ? styles.activeMeasermentcard
                          : styles.measuremntcard
                      }
                      onPress={() => handleSelectMeaser(index)}
                    >
                      <Text style={styles.measerlabel}>{item.part_name}</Text>
                      <TextInput
                        style={styles.measeureinput}
                        value={addMeasure.mea_value[index] || 0}
                        onChangeText={(text) =>
                          handleValueChange(index, text, item.dresses_part_id)
                        }
                        onPress={() => handleSelectMeaser(index)}
                        keyboardType="numeric"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            marginHorizontal: responsiveWidth(8),
            marginTop: responsiveHeight(1),
            position: "absolute",
            bottom: 0,
            width: responsiveWidth(83),
          }}
        >
          <TouchableOpacity style={styles.onlybtn} onPress={handleSubmit}>
            <Text style={styles.onlybtntext}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMeasurement;
