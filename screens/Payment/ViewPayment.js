import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal
} from "react-native";
import { styles, whiteColor, primaryColor, dangerColor } from "../../styles/style";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from "react-native-responsive-dimensions";
import { RadioButton } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
const PORT = process.env.EXPO_PUBLIC_API_URL;

const ViewPayment = ({ route }) => {
    const id = route.params.id;
    const custId = route.params.cutomeId;
    const navigation = useNavigation();
    //get cusromer name for showing cusromer name
    const [editCustomerData, setEditCustomerData] = useState([]);
    const getCustomerDataWithId = async () => {
        try {
            const response = await axios.get(`${PORT}/getcustomerdatawithid/${custId}`);
            const customerRows = response.data.rows[0];
            setEditCustomerData(customerRows);
        } catch (error) {
            console.error(error + "error in getting customer data in customer page");
        }
    };
    const [viewData, setViewData] = useState([]);
    const getPaymentData = async () => {
        try {
            const response = await axios.get(`${PORT}/getpaymentdatawithid/${id}`);
            const customerRows = response.data.rows[0];
            setViewData(customerRows);
        } catch (error) {
            console.error(error + "error in getting payment data in all payment page");
        }
    };
    //delete payment section start
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteName, setDeleteName] = useState("");
    const deleteModalVisibility = (id, pname) => {
        setIsDeleteModalVisible(!isDeleteModalVisible);
        setDeleteId(id);
        setDeleteName(pname);
    };

    const deletePayment = (deleteId) => {
        axios
            .delete(`${PORT}/deletepayment/${deleteId}`)
            .then(() => {
                navigation.goBack();
                setIsDeleteModalVisible(false);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const formatDate = (date) => {
        const pdate = new Date(date)
        const day = pdate.getDate().toString().padStart(2, "0");
        const month = (pdate.getMonth() + 1).toString().padStart(2, "0");
        const year = pdate.getFullYear();

        return `${day}/${month}/${year}`;
    };


    useFocusEffect(
        React.useCallback(() => {
            getPaymentData();
            getCustomerDataWithId();
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
                            {editCustomerData.customer_name} Payment
                        </Text>
                    </View>
                </View>

                <View style={styles.line70}></View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[styles.form, { marginTop: responsiveHeight(5) }]}>
                        <View style={{ marginBottom: responsiveHeight(2) }}>
                            <Text style={styles.label}>
                                <Text style={{ fontWeight: "900" }}>Customer Name : </Text>
                                <Text>{editCustomerData.customer_name}</Text>
                            </Text>
                        </View>
                        <View>
                            <View style={styles.inputfield}>
                                <Text style={[styles.label]}>Received Amount</Text>
                                <TextInput
                                    style={[styles.input, styles.disableInput]}
                                    editable={false}
                                    value={viewData.amount}
                                ></TextInput>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginBottom: responsiveHeight(2.2),
                                }}
                            >
                                <View
                                    style={{
                                        width: responsiveWidth(35),
                                        paddingRight: responsiveWidth(4),
                                    }}
                                >
                                    <Text style={{ marginBottom: responsiveHeight(1.5) }}>
                                        Round Amt
                                    </Text>
                                    <TextInput
                                        style={[styles.input, styles.disableInput]}
                                        editable={false}
                                        value={viewData.rounded}
                                    ></TextInput>
                                </View>
                                <View style={{ width: responsiveWidth(40) }}>
                                    <Text
                                        style={[
                                            styles.dashedBorder,
                                            { marginBottom: responsiveHeight(1.5) },
                                        ]}
                                    >
                                        Total Amount
                                    </Text>
                                    <Text style={{ fontWeight: "bold" }}>{parseFloat(parseInt(viewData.amount) + parseInt(viewData.rounded)).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputfield}>
                            <Text style={styles.label}>Payment Mode</Text>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <RadioButton
                                    value="Cash"
                                    status={viewData.payment_mode === "Cash" ? "checked" : "unchecked"}
                                    color={primaryColor}
                                    uncheckedColor={primaryColor}
                                    editable={false}
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
                                    Cash
                                </Text>

                                <View style={{ marginLeft: 10 }}>
                                    <RadioButton
                                        value="Bank"
                                        status={viewData.payment_mode === "Bank" ? "checked" : "unchecked"}
                                        color={primaryColor}
                                        editable={false}
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
                                    Bank
                                </Text>
                            </View>
                        </View>

                        <View style={styles.inputfield}>
                            <Text style={styles.label}>Remarks</Text>
                            <TextInput
                                style={[styles.input, styles.disableInput, { borderRadius: responsiveWidth(2) }]}
                                numberOfLines={3}
                                textAlignVertical="top"
                                multiline={true}
                                editable={false}
                                value={viewData.remark}
                            />
                        </View>

                        <View style={styles.inputfield}>
                            <Text style={styles.label}>Payment Date</Text>
                            <TextInput
                                style={[styles.adddateinput, styles.disableInput]}
                                value={
                                    viewData.payment_date ? formatDate(viewData.payment_date) : ""
                                }
                                editable={false}
                            />
                            <TouchableOpacity
                                style={styles.iconContainer}
                            >
                                <FontAwesome5 name="calendar-alt" size={24} color="black" />
                            </TouchableOpacity>
                        </View>


                    </View>
                </ScrollView>

                <View
                    style={[
                        styles.btngroup,
                        {
                            marginHorizontal: responsiveWidth(8),
                            marginTop: responsiveHeight(2),
                            paddingBottom: responsiveHeight(1.5),
                            justifyContent: "space-between",
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() =>
                            deleteModalVisibility(
                                viewData.id,
                                editCustomerData.customer_name
                            )
                        }
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
                            navigation.navigate("editPayment", { id: viewData.id, cid: custId });
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
            </SafeAreaView>

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
                                Are You Sure You Want To Delete {deleteName}'s payment  ?
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
                                    onPress={() => deletePayment(deleteId)}
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


        </>
    )
}

export default ViewPayment
