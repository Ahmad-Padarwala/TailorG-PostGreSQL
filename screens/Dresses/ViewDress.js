import React, { useContext, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles, whiteColor, dangerColor } from "../../styles/style";
import { AuthContext } from "../../middleware/AuthReducer";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ViewDress = ({ route }) => {
  const dressId = route.params.id;
  const navigation = useNavigation();
  const [gender, setGender] = useState('male');
  const [dressPrice, setDressPrice] = useState(0)
  const [uniquecode, setUniquecode] = useState('')
  const { userToken } = useContext(AuthContext);
  const [dressDetail, setDressDetail] = useState({});
  const [DressBodyParts, setDressBodyParts] = useState([]);
  const [bodyPartsNames, setBodyPartsNames] = useState({});

  //menu dropdown
  const [isMenuDropdownVisible, setIsMenuDropdownVisible] = useState(false);
  const openMenuDropdown = () => {
    setIsMenuDropdownVisible(!isMenuDropdownVisible);
  };
  const closeMenuDropdown = () => {
    setIsMenuDropdownVisible(false);
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const deleteModalVisibility = () => {
    closeMenuDropdown();
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  // get Dress Detail
  const getDressData = async (id) => {
    try {
      const response = await axios.get(
        `${PORT}/getdressdetail/${userToken}/${id}`
      );
      setDressDetail(response.data.rows[0]);
      await getDressParts(
        response.data.rows[0].id,
        response.data.rows[0].dress_unique_number
      );
      setUniquecode(response.data.rows[0].dress_unique_number)
      setGender(response.data.rows[0].gender);
      setDressPrice(response.data.rows[0].dress_price)
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };
  const [pathData, setPathData] = useState([]);
  const getPathData = async () => {
    await axios
      .get(`${PORT}/getpathesdata`)
      .then((res) => {
        setPathData(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // get Dress body parts
  const getDressParts = async (id, uniqueNumber) => {
    try {
      const response = await axios.get(
        `${PORT}/getdressbodyparts/${userToken}/${id}/${uniqueNumber}`
      );
      setDressBodyParts(response.data.rows);
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };

  // get body parts Name
  const getBodyPartsName = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getbodypartsforname/${userToken}`
      );
      const bodyParts = response.data.rows.reduce((acc, part) => {
        acc[part.id] = part.part_name;
        return acc;
      }, {});
      setBodyPartsNames(bodyParts);
    } catch (error) {
      console.error(
        error + "error in getting bodyparts data in bodyparts page"
      );
    }
  };

  // Delete Dress
  const deleteDress = async () => {
    try {
      await axios.delete(`${PORT}/deletedress/${userToken}/${dressId}`);
      setIsDeleteModalVisible(false);
      navigation.goBack();
    } catch (err) {
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
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getDressData(dressId);
      getBodyPartsName();
      getPathData()
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
              Dress Details
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={openMenuDropdown}>
              <MaterialIcons
                name="more-vert"
                size={23}
                color="black"
                style={{
                  alignSelf: "center",
                  marginRight: responsiveWidth(3),
                  marginTop: responsiveHeight(0.4),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line70}></View>
        <View style={{ marginTop: responsiveHeight(6) }}>
          <View style={styles.dressContainermain}>
            <View style={styles.dressContainer}>
              <View style={styles.imageContainer}>
                {
                  dressDetail.dress_image == "NoImage.jpg" ? (
                    <Image
                      source={require('../../assets/images/NoImage.jpg')}
                      style={{
                        width: "100%",
                        height: responsiveHeight(8),
                        borderRadius: 3,
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: `${pathData.image_path}/uploads/dresses/${dressDetail.dress_image}`,
                      }}
                      style={{
                        width: "100%",
                        height: responsiveHeight(8),
                        borderRadius: 3,
                      }}
                    />
                  )
                }
              </View>
              <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                {dressDetail.dress_name || "Loading"}
              </Text>
            </View>
            <View>
              <Text style={{ fontFamily: "Medium", marginBottom: responsiveHeight(0.5) }}>Price: <Text style={{ fontFamily: "Regular" }}>{dressPrice}</Text></Text>
              <View
                style={[
                  gender == "male"
                    ? styles.genderMale
                    : styles.genderFeMale
                  , { marginLeft: responsiveWidth(0) }]}
              >
                <Text style={styles.genderDropDownMeaserText}>
                  {gender}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              paddingHorizontal: responsiveWidth(8),
              marginBottom: responsiveHeight(0),
              fontFamily: "Medium",
              fontSize: responsiveFontSize(2),
              backgroundColor: whiteColor,
            }}
          >
            Body Parts
          </Text>
          <FlatList
            data={DressBodyParts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.dressContainermain}
            style={{
              marginVertical: responsiveHeight(1),
            }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.dressContainer,
                  {
                    paddingTop: responsiveWidth(1.3),
                    paddingBottom: responsiveWidth(0.4),
                    paddingHorizontal: responsiveHeight(0.7),
                    position: "relative",
                    width: responsiveWidth(25.9),
                  },
                ]}
              >
                <View
                  style={[
                    styles.imageContainer,
                    { height: responsiveHeight(10) },
                  ]}
                >
                  <Text style={{ textAlign: "center", fontFamily: "Regular" }}>
                    {bodyPartsNames[item.body_part_id] || "Loading..."}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        {/* dropdown modal */}
        <Modal
          transparent={true}
          visible={isMenuDropdownVisible}
          animationType="fade"
          onRequestClose={openMenuDropdown}
        >
          <TouchableWithoutFeedback onPress={closeMenuDropdown}>
            <View style={{ flex: 1 }}>
              <View style={styles.dressPartsdropdownMenu}>
                <TouchableOpacity
                  onPress={() => {
                    setIsMenuDropdownVisible(false)
                    navigation.navigate("editDress", { dressId: dressId });
                  }}
                  style={styles.dressPartsdropdownItem}
                >
                  <Text style={styles.dressPartsdropdownItemText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dressPartsdropdownItem}
                  onPress={deleteModalVisibility}
                >
                  <Text style={styles.dressPartsdropdownItemText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dressPartsdropdownItem}
                  onPress={() => {
                    navigation.navigate("addDressBodyParts", {
                      dress_unique_number: uniquecode,
                      gender: gender,
                      isEdit: true,
                      dressId: dressId,
                    });
                  }}
                >
                  <Text style={styles.dressPartsdropdownItemText}>
                    Edit Body Parts
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* delete modal */}
        <Modal
          animationType="slide"
          transparent
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
                  Are You Sure You Want To Delete Kurta1 ?
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
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={deleteDress}
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
      </SafeAreaView>
    </>
  );
};

export default ViewDress;