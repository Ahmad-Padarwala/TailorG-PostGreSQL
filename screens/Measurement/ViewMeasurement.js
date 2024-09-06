import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import {
  styles,
  dangerColor,
  primaryColor,
  secondaryColor,
  whiteColor,
} from "../../styles/style";
import Toast from 'react-native-toast-message';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";

const PORT = process.env.EXPO_PUBLIC_API_URL;

const ViewMeasurement = ({ route }) => {
  const navigation = useNavigation();
  const id = route.params.id;
  const cust_id = route.params.cust_id;
  const customerName = route.params.cust_name;
  const { userToken } = useContext(AuthContext);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [newMeasurementData, setNewMeasurementData] = useState([]);
  const [dressId, setDressId] = useState(null);

  const getViewMeasurementData = async () => {
    try {
      const response = await axios.get(`${PORT}/getviewmeasurementdata/${id}`);
      const customerRows = response.data.rows;
      setViewMeasurement(customerRows);
      setDressId(customerRows[0].id);
    } catch (error) {
      console.error(error + "error in getting view measurement data");
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
  //delete data section start
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const deleteModalVisibility = (id) => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
    setDeleteId(id);
  };

  const deleteMeasurement = (deleteId) => {
    axios
      .delete(`${PORT}/deletemeasurement/${deleteId}`)
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.msg) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err.response.data.msg,
            visibilityTime: 5000, // Display the toast for 5 seconds
            autoHide: true,
            position: "bottom"
          });
          setIsDeleteModalVisible(false);
        }
      });
  };

  const formatDate = (date) => {
    let pdate = new Date(date);
    const day = pdate.getDate().toString().padStart(2, "0");
    const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
    const year = pdate.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const refreshTheMeasData = async () => {
    try {
      // Get the new data
      const response = await axios.get(`${PORT}/getdressbodypartswithcid/${userToken}/${dressId}`);
      const newMeasurementData = response.data.rows;
      // Check for new body parts
      const oldBodyPartIds = viewMeasurement.map(item => item.dp_body_part_id);

      newMeasurementData.forEach(newItem => {
        if (!oldBodyPartIds.includes(newItem.body_part_id)) {
          axios.post(`${PORT}/addnewbodypartinmeasurement`, {
            dress_part_id: newItem.id,
            mea_value: 0,
            customer_measurement_id: viewMeasurement[0].cm_id,
            customer_id: cust_id,
            shop_id: userToken,
          })
            .then(() => {
              getViewMeasurementData();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };
  // const refreshTheMeasData = async () => {
  //   try {
  //     // Get the new data
  //     const response = await axios.get(`${PORT}/getdressbodypartswithcid/${userToken}/${dressId}`);
  //     const newMeasurementData = response.data.rows;

  //     // Check for new body parts
  //     const oldBodyPartIds = viewMeasurement.map(item => item.dp_body_part_id);

  //     newMeasurementData.forEach(newItem => {
  //       if (!oldBodyPartIds.includes(newItem.body_part_id)) {
  //         axios.post(`${PORT}/addnewbodypartinmeasurement`, {
  //           dress_part_id: newItem.id,
  //           mea_value: 0,
  //           customer_measurement_id: viewMeasurement[0].cm_id,
  //           customer_id: cust_id,
  //           shop_id: userToken,
  //         })
  //           .then(() => {
  //             getViewMeasurementData();
  //             Toast.show({
  //               type: 'success',
  //               text1: 'success',
  //               text2: "Measurement Body Part Added Successfully",
  //               visibilityTime: 5000, // Display the toast for 5 seconds
  //               autoHide: true,
  //               position: "bottom"
  //             });
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //           });
  //       }
  //       Toast.show({
  //         type: 'success',
  //         text1: 'success',
  //         text2: "Measurement Body Part is Upto date",
  //         visibilityTime: 5000, // Display the toast for 5 seconds
  //         autoHide: true,
  //         position: "bottom"
  //       });
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      getViewMeasurementData();
      getPathData();
      setIsDataLoaded(true);
    }, []) // Dependencies array ensures the effect runs when these values change
  );
  useEffect(() => {
    // Call refreshTheMeasData only if data is loaded and userToken is available
    if (isDataLoaded && dressId) {
      refreshTheMeasData();
    }
  }, [isDataLoaded, dressId]);

  const truncateString = (text, len) => {
    if (text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text;
  };
  const groupedData = viewMeasurement.reduce((acc, item) => {
    if (!acc[item.cm_id]) {
      acc[item.cm_id] = {
        cm_name: item.cm_name,
        cm_date: item.cm_date,
        dress_name: item.dress_name,
        dress_image: item.dress_image,
        gender: item.gender,
        measurements: [],
      };
    }
    acc[item.cm_id].measurements.push({
      part_name: item.bp_part_name,
      value: item.meval_value,
    });
    return acc;
  }, {});

  const renderItem = ({ item }) => (
    <View style={styles.measuremntcard}>
      <Text style={styles.measerlabel}>{item.part_name}</Text>
      <Text style={styles.measeureinput}>{item.value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
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
        <View style={{ width: responsiveWidth(79) }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: responsiveFontSize(2.5),
              fontFamily: "Medium",
            }}
          >
            {truncateString(customerName, 6)} Measurement
          </Text>
        </View>
      </View>
      <View style={styles.line70}></View>
      <ScrollView style={{
        marginBottom: responsiveHeight(5)
      }}>
        {Object.values(groupedData).map((group, index) => (
          <View
            key={index}
            style={[styles.form, { marginTop: responsiveHeight(5) }]}
          >
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
                    group.dress_image == "NoImage.jpg" ? (
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
                          uri: `${pathData}/uploads/dresses/${group.dress_image}`,
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
                      {truncateString(group.dress_name, 16)}
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
                          color: secondaryColor,
                        }}
                      >
                        {formatDate(group.cm_date)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={
                  group.gender == "male"
                    ? styles.messurementGenderMain
                    : [
                      styles.messurementGenderMain,
                      { backgroundColor: dangerColor },
                    ]
                }
              >
                <Text style={styles.messurementGender}>{group.gender}</Text>
              </View>
            </View>

            <View
              style={[styles.inputfield, { marginTop: responsiveHeight(2) }]}
            >
              <Text style={styles.label}>Measurement Name</Text>
              <Text style={styles.input}>{group.cm_name}</Text>
            </View>

            <View>
              <Text style={styles.label}>Measurement</Text>
              <FlatList
                data={group.measurements}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={styles.addMeasurementgrid}
                scrollEnabled={false}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        style={[
          styles.btngroup,
          {
            marginHorizontal: responsiveWidth(8),
            marginTop: responsiveHeight(-3),
            paddingBottom: responsiveHeight(3.4),
            justifyContent: "space-between"
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => deleteModalVisibility(id)}
          style={[
            styles.btnactive,
            {
              backgroundColor: dangerColor,
              shadowColor: dangerColor,
              shadowOffset: {
                width: 5,
                height: 7,
              },
              shadowOpacity: 5,
              shadowRadius: 7.68,
              elevation: 15,
            },
          ]}
        >
          <Text
            style={[
              styles.btntext,
              {
                color: whiteColor,
                paddingHorizontal: responsiveWidth(10),
                fontSize: responsiveFontSize(2),
              },
            ]}
          >
            <Ionicons name="trash" size={14}></Ionicons> Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnactive,
            styles.active,
            {
              shadowColor: primaryColor,
              shadowOffset: {
                width: 5,
                height: 7,
              },
              shadowOpacity: 5,
              shadowRadius: 7.68,
              elevation: 15,
            },
          ]}
          onPress={() => {
            navigation.navigate("editmeasurement", { id: id });
          }}
        >
          <Text
            style={[
              styles.btntext,
              styles.active,
              {
                fontSize: responsiveFontSize(2),
                paddingHorizontal: responsiveWidth(13),
              },
            ]}
          >
            <Ionicons name="pencil" size={14}></Ionicons> Edit
          </Text>
        </TouchableOpacity>
      </View>
      {/* delete modal */}
      <Modal
        animationType="slide"
        transparent
        onRequestClose={deleteModalVisibility}
        visible={isDeleteModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={deleteModalVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: responsiveHeight(2),
                }}
              >
                <Ionicons name="trash" size={35} color={dangerColor}></Ionicons>
              </Text>
              <Text
                style={{
                  fontFamily: "Regular",
                  fontSize: responsiveFontSize(2),
                }}
              >
                Are You Sure You Want To Delete ?
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: responsiveHeight(2),
                marginBottom: responsiveHeight(0),
              }}
            >
              <View
                style={[
                  styles.modelAlertbtn,
                  {
                    backgroundColor: "white",
                    borderColor: dangerColor,
                    borderWidth: 2,
                    marginRight: responsiveWidth(3.4),
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={deleteModalVisibility}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.3),
                      fontFamily: "Regular",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.modelAlertbtn,
                  {
                    marginLeft: responsiveWidth(3.4),
                    paddingVertical: responsiveWidth(2),
                    backgroundColor: dangerColor,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => deleteMeasurement(deleteId)}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.3),
                      color: whiteColor,
                      fontFamily: "Regular",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

export default ViewMeasurement;
