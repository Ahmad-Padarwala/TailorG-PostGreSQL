import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import {
  dangerColor,
  primaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { Ionicons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import SwitchToggle from "react-native-switch-toggle";
import { useFonts } from "expo-font";
import { RadioButton } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../middleware/AuthReducer";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const Bodyparts = () => {
  const [fontsLoaded] = useFonts({
    Medium: require("../../assets/Font/Poppins-Medium.ttf"),
    Bold: require("../../assets/Font/Poppins-Bold.ttf"),
    ExtraBold: require("../../assets/Font/Poppins-ExtraBold.ttf"),
    SemiBold: require("../../assets/Font/Poppins-SemiBold.ttf"),
    Regular: require("../../assets/Font/Poppins-Regular.ttf"),
  });
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [Ordertype, setOrdertype] = useState("All");
  const category = ["All", "Male", "Female", "Active", "Disable"];
  const [refreshing, setRefreshing] = useState(false);
  const [addBodyPart, setAddBodyPart] = useState({
    part_name: "",
    gender: "male",
    shop_id: userToken,
  });
  const [loading, setLoading] = useState(true);
  const [partData, setPartData] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  //get all body part data
  const getBodyPartsData = async () => {
    try {
      const response = await axios.get(`${PORT}/getbodypartdata/${userToken}`, {
        params: { gender: Ordertype },
      });
      const customerRows = response.data.rows;
      setPartData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting body parts data");
      setLoading(false);
    }
  };
  //refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getBodyPartsData();
    setRefreshing(false);
  };
  //add body part data
  const handleChange = (name, value) => {
    setAddBodyPart((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };
  const saveAddData = () => {
    if (addBodyPart.part_name == "") {
      alert("Please Insert Body Part Name");
      return;
    }
    setLoading(true);
    axios
      .post(`${PORT}/addbodypartsdata`, addBodyPart)
      .then((res) => {
        getBodyPartsData();
        setModalVisible(!isModalVisible);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'body parts succesfully add',
          visibilityTime: 5000, // Display the toast for 5 seconds
          autoHide: true,
          position: "bottom"
        });
        setLoading(false);
        setAddBodyPart({
          part_name: "",
          gender: "male",
          shop_id: userToken,
        });
      })
      .catch((err) => {
        console.error(err + "error in adding body parts data");
        setLoading(false);
      });
  };

  //update status
  const toggleSwitch = (id, sts) => {
    updateStatus(id, sts);
  };
  const updateStatus = (id, status) => {
    axios
      .put(`${PORT}/changestatusbodypart/${id}/${status}`)
      .then(() => {
        getBodyPartsData();
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'body parts status edited',
          visibilityTime: 3000, // Display the toast for 5 seconds
          autoHide: true,
          position: "bottom"
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //add model code
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };
  //edit model code
  const [isEditModalVisible, setIsEDitModalVisible] = useState(false);
  const toggleEditModalVisibility = (id) => {
    setIsViewModalVisible(false);
    setIsEDitModalVisible(!isEditModalVisible);
    if (!isEditModalVisible) {
      geEdittBodyPartsData(id);
    }
  };
  //view model code
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const toggleViewModalVisibility = (id) => {
    setIsViewModalVisible(!isViewModalVisible);
    if (!isViewModalVisible) {
      geEdittBodyPartsData(id);
    }
  };
  //get data for edit
  const [editBodyPart, setEditBodyPart] = useState({
    part_name: "",
    gender: "",
  });
  const geEdittBodyPartsData = async (editId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${PORT}/geteditbodypartdata/${editId}`);
      const customerRows = response.data.rows[0];
      setEditBodyPart(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting edit body parts data");
      setLoading(false);
    }
  };

  //edit body parts data
  const handleEditChange = (name, value) => {
    setEditBodyPart((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };
  const updateBodyPart = (id) => {
    if (editBodyPart.part_name == "") {
      alert("Please Insert Body Part Name");
      return;
    }
    setLoading(true);
    axios
      .put(`${PORT}/updatebodypartdata/${id}`, editBodyPart)
      .then(() => {
        getBodyPartsData();
        setIsEDitModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'body parts update succesfully',
          visibilityTime: 5000, // Display the toast for 5 seconds
          autoHide: true,
          position: "bottom"
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //delete body part data start
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const deleteModalVisibility = (id, pname) => {
    setIsViewModalVisible(false);
    setIsDeleteModalVisible(!isDeleteModalVisible);
    setDeleteId(id);
    setDeleteName(pname);
  };

  const deleteBodyPart = (deleteId) => {
    setLoading(true);
    axios
      .delete(`${PORT}/deletebodypart/${deleteId}`)
      .then(() => {
        getBodyPartsData();
        setIsDeleteModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'body parts deleted succesfully',
          visibilityTime: 5000, // Display the toast for 5 seconds
          autoHide: true,
          position: "bottom"
        });
        setLoading(false);
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
        } else {
          console.error(err);
        }
        setLoading(false);
      });
  };


  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    getBodyPartsData();
  }, [Ordertype]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: whiteColor, flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator
              size={70}
              color={primaryColor}
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 10,
              }}
            />
          </View>
        ) : (
          <View style={styles.flatlistheader}>
            <View style={styles.headername}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color="black"
                  style={{
                    alignSelf: "center",
                    marginRight: responsiveWidth(2),
                  }}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.headernametext}>Body Parts</Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(70),
                  height: responsiveHeight(5),
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <SelectDropdown
                  data={category}
                  onSelect={(selectedItem, idx) => {
                    setOrdertype(selectedItem, idx);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  defaultButtonText={"All"}
                  buttonStyle={{
                    backgroundColor: whiteColor,
                    width: "45%",
                    left: 22,
                  }}
                  buttonTextStyle={{
                    fontSize: 14,
                    color: primaryColor,
                    textAlign: "center",
                    fontFamily: "Medium",
                  }}
                  selectedRowTextStyle={{
                    fontSize: 14,
                    fontFamily: "Medium",
                    color: primaryColor,
                    opacity: 1,
                  }}
                  dropdownStyle={{ marginTop: -10, borderRadius: 5 }}
                  rowTextStyle={{
                    fontSize: 14,
                    fontFamily: "Regular",
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <Ionicons
                        style={{ marginLeft: responsiveWidth(-6) }}
                        name="chevron-down-outline"
                        size={16}
                      ></Ionicons>
                    );
                  }}
                />
              </View>
            </View>
            {partData != "" ? (
              <FlatList
                data={partData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: responsiveHeight(6),marginTop: responsiveHeight(1) }}
                onScroll={(e) => {
                  const currentOffset = e.nativeEvent.contentOffset.y;
                  const direction =
                    currentOffset > scrollOffset ? "down" : "up";
                  setIsButtonVisible(direction === "up");
                  setScrollOffset(currentOffset);
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => toggleViewModalVisibility(item.id)}
                  >
                    <View key={index} style={styles.bodypartsbox}>
                      <View style={styles.bodypartsboxshadow}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Text style={styles.bodypartsboxtext}>
                            {item.part_name}
                          </Text>
                          <View
                            style={[
                              item.gender == "male"
                                ? styles.genderMale
                                : styles.genderFeMale
                              , { marginLeft: responsiveWidth(5) }]}
                          >
                            <Text style={styles.genderDropDownMeaserText}>
                              {item.gender}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.rightsidebox}>
                          <View>
                            <SwitchToggle
                              value={item.status === 1}
                              switchOn={item.status === 1}
                              onPress={() => toggleSwitch(item.id, item.status)}
                              circleColorOff={whiteColor}
                              circleColorOn={whiteColor}
                              backgroundColorOn={primaryColor}
                              backgroundColorOff={dangerColor}
                              containerStyle={{
                                width: 40,
                                height: 18,
                                borderRadius: 25,
                              }}
                              circleStyle={{
                                width: 20,
                                height: 18,
                                borderRadius: 25,
                                alignSelf:
                                  item.status === 1 ? "flex-start" : "flex-end",
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: responsiveHeight(80),
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(3),
                    opacity: 0.4,
                    fontFamily: "Regular",
                  }}
                >
                  No Body Parts Found
                </Text>
                <TouchableOpacity
                  style={{ width: responsiveWidth(70) }}
                  onPress={toggleModalVisibility}
                >
                  <Text
                    style={[
                      {
                        textAlign: "center",
                        marginTop: responsiveHeight(3),
                        fontSize: responsiveFontSize(2),
                        borderRadius: 10,
                        padding: responsiveHeight(1),
                        color: whiteColor,
                        fontFamily: "Regular",
                        backgroundColor: primaryColor,
                      },
                    ]}
                  >
                    Add Body Parts
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {/* add modal */}
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          onRequestClose={toggleModalVisibility}
          presentationStyle="overFullScreen"
          onDismiss={toggleModalVisibility}
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Text style={styles.modellabel}>
                Body Parts Name <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter Body Parts"
                style={styles.modalinput}
                onChangeText={(text) => handleChange("part_name", text)}
                value={addBodyPart.part_name}
              />
              <Text style={styles.modellabel}>
                Select Gender <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value="male"
                  status={
                    addBodyPart.gender === "male" ? "checked" : "unchecked"
                  }
                  onPress={() => handleChange("gender", "male")}
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
                    status={
                      addBodyPart.gender === "female" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("gender", "female")}
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
                      backgroundColor: dangerColor,
                      marginRight: responsiveWidth(3.4),
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={toggleModalVisibility}
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
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={saveAddData}
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
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* edit model */}
        <Modal
          animationType="slide"
          transparent
          visible={isEditModalVisible}
          onRequestClose={toggleEditModalVisibility}
          presentationStyle="overFullScreen"
          onDismiss={toggleEditModalVisibility}
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <Text style={styles.modellabel}>
                Body Parts Name <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <TextInput
                style={styles.modalinput}
                onChangeText={(text) => handleEditChange("part_name", text)}
                value={editBodyPart.part_name}
              />
              <Text style={styles.modellabel}>
                Select Gender <Text style={{ color: dangerColor }}>*</Text>
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <RadioButton
                  value={editBodyPart.gender}
                  status={
                    editBodyPart.gender === "male" ? "checked" : "unchecked"
                  }
                  onPress={() => handleEditChange("gender", "male")}
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
                    value={editBodyPart.gender}
                    status={
                      editBodyPart.gender === "female" ? "checked" : "unchecked"
                    }
                    onPress={() => handleEditChange("gender", "female")}
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
                      backgroundColor: dangerColor,
                      marginRight: responsiveWidth(3.4),
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={toggleEditModalVisibility}
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
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => updateBodyPart(editBodyPart.id)}
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
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* view model */}
        <Modal
          animationType="slide"
          transparent
          visible={isViewModalVisible}
          onRequestClose={toggleViewModalVisibility}
          presentationStyle="overFullScreen"
          onDismiss={toggleViewModalVisibility}
        >
          <TouchableOpacity style={styles.viewWrapper} activeOpacity={1}
            onPress={toggleViewModalVisibility}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modellabel}>Body Parts Name</Text>
                <TextInput
                  style={[styles.modalinput, styles.disableInput]}
                  onChangeText={(text) => handleEditChange("part_name", text)}
                  value={editBodyPart.part_name}
                  editable={false}
                />
                <Text style={styles.modellabel}>Select Gender</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <RadioButton
                    value={editBodyPart.gender}
                    status={
                      editBodyPart.gender === "male" ? "checked" : "unchecked"
                    }
                    onPress={() => handleEditChange("gender", "male")}
                    color="black"
                    disabled
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
                      value={editBodyPart.gender}
                      status={
                        editBodyPart.gender === "female" ? "checked" : "unchecked"
                      }
                      onPress={() => handleEditChange("gender", "female")}
                      color="black"
                      disabled
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
                        backgroundColor: dangerColor,
                        marginRight: responsiveWidth(3.4),
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        deleteModalVisibility(
                          editBodyPart.id,
                          editBodyPart.part_name
                        )
                      }
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

                  <View
                    style={[
                      styles.modelAlertbtn,
                      {
                        marginLeft: responsiveWidth(3.4),
                        paddingVertical: responsiveWidth(2),
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => toggleEditModalVisibility(editBodyPart.id)}
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
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

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
                  <Ionicons
                    name="trash"
                    size={35}
                    color={dangerColor}
                  ></Ionicons>
                </Text>
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Are You Sure You Want To Delete {deleteName} ?
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
                    onPress={() => deleteBodyPart(deleteId)}
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
      {isButtonVisible && (
        <View style={styles.addmaincontainer}>
          <TouchableOpacity onPress={toggleModalVisibility}>
            <View style={styles.innercontainer}>
              <Text style={styles.pluscomptext}>
                <Ionicons
                  name="add-outline"
                  size={35}
                  color={whiteColor}
                ></Ionicons>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
      }
    </>
  );
};

export default Bodyparts;
