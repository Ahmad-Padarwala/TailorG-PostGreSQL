import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  dangerColor,
  secondaryColor,
  styles,
  whiteColor,
} from "../../styles/style";

const PORT = process.env.EXPO_PUBLIC_API_URL;

const EditMeasurement = ({ route }) => {
  const navigation = useNavigation();
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const id = route.params.id;

  const [editMeasurement, setEditMeasurement] = useState({
    name: "",
    dresses_id: null,
    mea_value: [],
  });
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
  const getViewMeasurementData = async () => {
    try {
      const response = await axios.get(`${PORT}/geteditwmeasurementdata/${id}`);
      const measurementData = response.data.rows;
      const updatedEditMeasurement = {
        name: measurementData[0].name,
        dresses_id: measurementData[0].dresses_id,
        msv_dresses_part_id: measurementData[0].msv_dresses_part_id,
        dname: measurementData[0].ds_name,
        dimage: measurementData[0].ds_dress_image,
        mdate: measurementData[0].created_date,
        mgender: measurementData[0].ds_gender,
        mea_value: measurementData.map((data) => ({
          part_name: data.part_name,
          mea_value: data.mea_value,
          msv_dresses_part_id: data.msv_dresses_part_id,
        })),
      };
      setEditMeasurement(updatedEditMeasurement);
    } catch (error) {
      console.error("Error in getting view measurement data:", error);
    }
  };
  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    getViewMeasurementData();
    getPathData()
  }, []);

  const handleChange = (name, value) => {
    setEditMeasurement((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectMeaser = (index) => {
    setSelectedCardIndex(index);
  };

  //edit code section start
  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${PORT}/editmeasureparts/${id}`,
        editMeasurement
      );

      if (response.status === 200) {
        navigation.goBack();
      } else {
        console.log("Error", "Upload failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              Edit Measurement
            </Text>
          </View>
        </View>
        <View style={styles.line70}></View>

        <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
          <View style={styles.inputfield}>
            <Text style={styles.label}>Dress Type</Text>
            <View style={styles.mainMeasurmentSection}>
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.measurementKurtaImageMain}>

                  {
                    editMeasurement.dimage == "NoImage.jpg" ? (
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
                          uri: `${pathData}/uploads/dresses/${editMeasurement.dimage}`,
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
                <View style={{ marginHorizontal: responsiveWidth(2) }}>
                  <View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: "Regular",
                      }}
                    >
                      {editMeasurement.dname}
                      {/* {truncateString(editMeasurement.dname, 16)} */}
                    </Text>
                  </View>
                  <View style={{ flex: 0, flexDirection: "row" }}>
                    <View>
                      <Ionicons
                        name="time-outline"
                        style={{
                          marginTop: responsiveHeight(0.2),
                          color: secondaryColor,
                        }}
                        size={10}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.2),
                          marginTop: responsiveHeight(0),
                          marginHorizontal: responsiveWidth(1),
                          color: secondaryColor,
                        }}
                      >
                        {formatDate(editMeasurement.mdate)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.messurementGenderMain}>
                <Text style={styles.messurementGender}>
                  {editMeasurement.mgender}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inputfield}>
            <Text style={styles.label}>
              Measurement Name <Text style={{ color: dangerColor }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={editMeasurement.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>

          <View style={styles.mainMeaserContainer}>
            <Text style={styles.label}>Measurement</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                marginBottom: responsiveHeight(8),
              }}
            >
              <View style={styles.addMeasurementgrid}>
                {editMeasurement.mea_value.map((item, index) => (
                  <TouchableOpacity
                    style={
                      selectedCardIndex === index
                        ? styles.activeMeasermentcard
                        : styles.measuremntcard
                    }
                    onPress={() => handleSelectMeaser(index)}
                    key={index}
                  >
                    <Text style={styles.measerlabel}>{item.part_name}</Text>
                    <TextInput
                      style={styles.measeureinput}
                      value={item.mea_value}
                      onChangeText={(text) => {
                        const updatedValues = [...editMeasurement.mea_value];
                        if (updatedValues[index]) {
                          updatedValues[index].mea_value = text;
                          setEditMeasurement((prevData) => ({
                            ...prevData,
                            mea_value: updatedValues,
                          }));
                        }
                      }}
                      onFocus={() => handleSelectMeaser(index)}
                      keyboardType="numeric"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
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
            <Text style={styles.onlybtntext}>Update</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditMeasurement;
