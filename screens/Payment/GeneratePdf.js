import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import {
  dangerColor,
  primaryColor,
  secondaryColor,
  styles,
  whiteColor,
} from "../../styles/style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { AuthContext } from "../../middleware/AuthReducer";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { format } from "date-fns";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
const { width, height } = Dimensions.get('screen');
const PORT = process.env.EXPO_PUBLIC_API_URL;


const GeneratePdf = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const route = useRoute();
  const { customId, startDate, endDate } = route.params;
  const [loading, setLoading] = useState(true);

  //get payment data
  const [paymentData, setPaymentData] = useState([]);
  const getPaymentData = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getallpaymentdata/${customId}/${userToken}`
      );
      const customerRows = response.data.rows.map(payment => ({
        ...payment,
        type: 'payment',
        date: payment.payment_date ? format(new Date(payment.payment_date), 'dd-MM-yyyy') : null, // Replace with the actual payment date field
      }));
      setPaymentData(customerRows);
    } catch (error) {
      console.error(error + ' error in getting payment data in all payment page');
    }
  };

  const [order, setOrder] = useState([]);
  const getCustomerOrder = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getAllCustomerOrder/${userToken}`
      );
      const orderRows = response.data.rows.map(order => ({
        ...order,
        type: 'order',
        date: order.order_date ? format(new Date(order.order_date), 'dd-MM-yyyy') : null, // Replace with the actual order date field
      }));
      setOrder(orderRows);
    } catch (error) {
      console.error(error + ' error in getting order data in order page');
    }
  };
  const [filteredPaymentData, setFilteredPaymentData] = useState([]);
  const filterData = () => {
    const filteredData = paymentData.filter((item) => {
      const paymentDate = new Date(item.payment_date);
      const isWithinDateRange =
        paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
      return isWithinDateRange;
    });
    setFilteredPaymentData(filteredData);
  };


  const truncateString = (text, len) => {
    if (text && text.length > len) {
      return text.substring(0, len) + "...";
    }
    return text || "";
  };

  //get shop data for shop name
  const [shopData, setShopData] = useState([]);
  const getShopData = async () => {
    await axios
      .get(`${PORT}/getshopdata/${userToken}`)
      .then((res) => {
        setShopData(res.data.rows[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //get bank detail data 
  const [bankDetail, setBankDetail] = useState([]);
  const getBankDetail = async () => {
    try {
      const response = await axios.get(`${PORT}/getallbankdata/${userToken}`);
      const bankdata = response.data.rows;
      setBankDetail(bankdata);
    } catch (error) {
      console.error(error + "error in getting bank data");
    }
  };

  //get cusromer name for showing cusromer name
  const [editCustomerData, setEditCustomerData] = useState([]);
  const getCustomerDataWithId = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getcustomerdatawithid/${customId}`
      );
      const customerRow = {
        ...response.data.rows[0],
        type: 'customer',
        date: response.data.rows[0].created_date ? format(new Date(response.data.rows[0].created_date), 'dd-MM-yyyy') : null, // Replace with the actual customer created date field
      };
      setEditCustomerData(customerRow);
    } catch (error) {
      console.error(error + ' error in getting customer data in customer page');
    }
  };
  //all data into one state
  const [mergedData, setMergedData] = useState([]);
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toISOString();
  };

  const mergeAndSortData = () => {
    // Prepare editCustomerData
    const formattedCustomerData = editCustomerData.date
      ? { ...editCustomerData, date: parseDate(editCustomerData.date) }
      : { ...editCustomerData, date: null };

    // Prepare all data
    const allData = [
      formattedCustomerData,
      ...order.map(order => ({
        ...order,
        date: order.order_date ? new Date(order.order_date).toISOString() : null,
      })),
      ...paymentData.map(payment => ({
        ...payment,
        date: payment.payment_date ? new Date(payment.payment_date).toISOString() : null,
      })),
    ];

    // Filter and sort data
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredData = allData.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    const sortedData = filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    setMergedData(sortedData);
  };

  //get all sum of amount
  const totalUserAmount = filteredPaymentData.reduce((sum, pay) => {
    return sum + parseInt(pay.amount) + parseInt(pay.rounded);
  }, 0);

  //get data for total due
  const [totalDueData, setTotalDueData] = useState([]);
  const getDataForTotalDue = async () => {
    try {
      const response = await axios.get(
        `${PORT}/getdatafortotaldue/${customId}`
      );
      const customerRows = response.data.rows;
      setTotalDueData(customerRows);
      setLoading(false);
    } catch (error) {
      console.error(error + "error in getting customer data in customer page");
      setLoading(false);
    }
  };
  const formatDate = (date) => {
    if (!date) return 'Invalid Date';
    const d = new Date(date);
    return d.toLocaleDateString();
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

  const filteredTotalDueData = totalDueData.filter((item) => {
    const itemDate = new Date(item.order_date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const customerTotalDue = filteredTotalDueData.reduce((total, item) => {
    let multiplication = parseInt(item.price) * parseInt(item.qty);
    return total + multiplication;
  }, 0);

  const totalFinBalanceColor = totalUserAmount - customerTotalDue >= 0
    ? primaryColor
    : dangerColor;


  const generatePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });
      const currentDate = format(new Date(), "dd-MM-yyyy-HH-mm-ss");
      const fileName = `${editCustomerData.customer_name}-legder-${currentDate}.pdf`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });
      return newPath;
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const sharePdf = async () => {
    const fileUri = await generatePdf();
    if (fileUri && Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getPaymentData();
      getCustomerDataWithId();
      getDataForTotalDue();
      getBankDetail();
      getShopData();
      getPathData();
      getCustomerOrder();
    }, [])
  );


  useEffect(() => {
    mergeAndSortData();
  }, [paymentData, order, editCustomerData]);

  useEffect(() => {
    filterData();
  }, [paymentData]);

  const [finalBalance, setFinalBalance] = useState(0);
  let prevBalance = 0;
  const totalBalanceColor = finalBalance < 0 ? dangerColor : primaryColor;
  const generateTableRows = (data) => {
    return data.map((item, index) => {
      const orderPrice = parseFloat(item.order_price) || 0;
      const qty = parseFloat(item.qty) || 0;
      const amount = parseFloat(item.amount) || 0;
      const rounded = parseFloat(item.rounded) || 0;

      let currentBalance = prevBalance;
      if (item.type === "order") {
        currentBalance -= orderPrice * qty;
      } else if (item.type === "payment") {
        currentBalance += amount + rounded;
      }
      
      currentBalance = parseFloat(currentBalance.toFixed(2));
      prevBalance = currentBalance;
      const balanceColor = currentBalance < 0 ? dangerColor : primaryColor;

      return `
       <tr>
          <td>${new Date(item.date).toLocaleDateString()}</td>
          <td>${item.type === "customer"
          ? "Opening Amount"
          : item.remark || (item.type === "order" ? item.dress_name || "No Dress Name" : "No Remark")
        }</td>
          <td style="color: ${balanceColor};">${item.type === "order" ? -orderPrice * qty : 0}</td>
          <td style="color:#56BC1F">
            ${item.type === "customer" || item.type === "order" ? "" : parseFloat(item.amount).toFixed(2)}
          </td>
          <td>
            ${item.type === "customer" || item.type === "order" ? "" : parseFloat(item.rounded).toFixed(2)}
          </td>
          <td style="color: ${balanceColor};">${currentBalance.toFixed(2)}</td>
        </tr>
      `;
    }).join("");
  };
  const htmlContent = `
  <html>
    <head> 
   <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
      }
      .content {
          padding: 20px;
      }

      #header-image {
          width: 20px;
          height: 20px;
          margin-left: 10px;
          margin-top: 9px;
      }
      .table {
          width: 100%;
          border-collapse: collapse;
      }

      .table th,
      .table td {
          border: 1px solid lightgray;
          text-align: left;
          padding:5px 0px 5px 5px;
      }

      .table th {
          background-color: #f2f2f2;
          font-weight: 600;
      }
  </style>
    </head>
    <body>
      <div class="content">
      <div>
          <div
              style="display: flex; align-items: center; background-color: #56BC1F; padding: 7px; border-radius: 10px;">
              <div style="border-radius: 50%; width: 40px;height: 40px; background-color: white; margin-right: 10px">
                  <img src="https://5.imimg.com/data5/SELLER/Default/2020/9/QW/JA/WM/27911551/31k-leather-machine-500x500.png"
                      id="header-image" />
              </div>
              <div>
                  <span style="color:white; font-weight: bold;">${shopData.shop_name}</span>
              </div>
          </div>
          <div>
              <p style="padding: 0;margin: 15px 0px 5px 0px;"><strong>Customer Name: </strong>${editCustomerData.customer_name
    }</p>
              <div style="display: flex;justify-content:space-between;">

                  <p style="padding: 0;margin: 0px;"><strong>From Date: </strong>${formatDate(startDate)}</p>

                  <p style="margin-left: 20px;padding: 0;margin: 0px;"><strong>To Date:
                      </strong>${formatDate(endDate)}</p>

              </div>
          </div>
          <div style="display: flex; border: 1px solid lightgray;margin-top:15px;padding:8px 0px;">
              <div style="width: 25%; border-right: 1px solid lightgray;padding-left:10px;">
                  <p style="margin:3px 0px">Op Amt:</p>
                  <p style="color: #56BC1F;margin:0">0.00</p>
              </div>
              <div style="width: 25%; border-right: 1px solid lightgray;padding-left:10px;">
                  <p style="margin:3px 0px">Total Paid:</p>
                  <p style="color: #56BC1F;margin:0">${totalUserAmount.toFixed(2)}</p>
              </div>
              <div style="width:25%; border-right:1px solid lightgray;padding-left:10px;">
                  <p style="margin:3px 0px">Total Due:</p>
                  <p style="color: #BC1F1F;margin:0">${parseFloat(customerTotalDue).toFixed(2)}</p>
              </div>
              <div style="width: 25%;padding-left:10px;">
                  <p style="margin:3px 0px">Final Bal</p>
                  <p style="color: ${totalFinBalanceColor};margin:0">${parseFloat(totalUserAmount - customerTotalDue).toFixed(2)}</p>
              </div>
          </div>
          <div class="section">
      <table class="table" style="margin-top: 15px;">
        <tr>
          <th style="width: 15%;">Date</th>
          <th style="width: 30%;">Description</th>
          <th style="width: 14%;">Due Amt</th>
          <th style="width: 14%;">Paid Amt</th>
          <th style="width: 13%;">Round</th>
          <th style="width: 14%;">Balance</th>
        </tr>
        ${generateTableRows(mergedData)}
        <tr style="background-color: #f2f2f2;">
          <td colspan="2">Final Balance</td>
           <td></td>
          <td></td>
          <td></td>
          <td style="color: ${totalBalanceColor};">${parseFloat(finalBalance).toFixed(2)}</td>
        </tr>
      </table>
    </div>
    <div class="section">
<h3>Payment Detail:</h3>
${bankDetail.length > 0 ? `
  <div style="display: flex; align-items: center; border-radius: 6px; background-color: white; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; margin-bottom: 2px;">
    <div style="padding:20px;">
      <img src="${pathData}/uploads/bank/${bankDetail[0].image}"  width="140px" height="140px" />
    </div>
    <div>
      <p style="margin: 5px 0px;"><strong>${shopData.last_name} ${shopData.first_name}</strong></p>
      <p style="margin: 5px 0px;"><strong>Bank:</strong> ${bankDetail[0].bank_name}</p>
      <p style="margin: 5px 0px;"><strong>AC No:</strong> ${bankDetail[0].ac_no}</p>
      <p style="margin: 5px 0px;"><strong>IFSC:</strong> ${bankDetail[0].ifsc_code}</p>
    </div>
  </div>
` : `
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 150px; margin-top: 10px; margin-bottom: 20px; border-radius: 6px; background-color: white; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
    <p style="font-size: 16px; opacity: 0.4; margin: 10px 0;">No Bank Detail Found</p>
    <a href="bankDetails.html" style="width: 60%; text-align: center; font-size: 16px; border-radius: 10px; padding: 10px; color: white; background-color: ${primaryColor}; text-decoration: none;">Add Bank Detail</a>
  </div>
`}
</div>

      </div>
    </body>
  </html>
`;
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
          <View style={{ width: responsiveWidth(75) }}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: responsiveFontSize(2.5),
                fontFamily: "Medium",
              }}
            >
              {truncateString(editCustomerData.customer_name, 7)} Legder
            </Text>
          </View>
          <View style={{ width: responsiveWidth(12) }}>
            <TouchableOpacity onPress={sharePdf}>
              <Ionicons name="share-social-sharp" size={23}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line70}></View>
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.flatlistheader}>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              backgroundColor: primaryColor,
              padding: 7,
              alignItems: "center",
              borderRadius: responsiveWidth(1),
            }}
          >
            <View
              style={{
                backgroundColor: whiteColor,
                borderRadius: 100,
                width: responsiveWidth(9),
                height: responsiveHeight(4.2),
                marginHorizontal: responsiveWidth(3),
              }}
            >
              <Image
                source={require("../../assets/favicon.png")}
                style={{
                  width: responsiveWidth(6),
                  height: responsiveHeight(4.2),
                  marginHorizontal: "auto",
                }}
              />
            </View>
            <View>
              <Text style={{ color: whiteColor, fontFamily: "SemiBold" }}>
                {shopData.shop_name}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: responsiveHeight(2) }}>
            <Text style={styles.label}>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: width * 0.034,
                }}
              >
                Customer Name :{" "}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.034,
                }}
              >
                {editCustomerData.customer_name}
              </Text>
            </Text>
          </View>

          <View
            style={{
              flex: 0,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.label}>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    fontSize: width * 0.034,
                  }}
                >
                  From Date:{" "}
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.034,
                  }}
                >
                  {formatDate(startDate)}
                </Text>
              </Text>
            </View>
            <View>
              <Text style={styles.label}>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    fontSize: width * 0.034,
                  }}
                >
                  To Date:{" "}
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.034,
                  }}
                >
                  {formatDate(endDate)}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 0,
              flexDirection: "row",
              borderColor: secondaryColor,
              borderWidth: 0.5,
              padding: 5,
            }}
          >
            <View
              style={{
                borderRightWidth: 0.8,
                borderRightColor: secondaryColor,
                paddingRight: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                Op Amt:
              </Text>
              <Text
                style={{
                  color: primaryColor,
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                0.00
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 0.8,
                borderRightColor: secondaryColor,
                paddingHorizontal: 2.5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                Total Paid:
              </Text>
              <Text
                style={{
                  color: primaryColor,
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                {totalUserAmount.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 0.8,
                borderRightColor: secondaryColor,
                paddingHorizontal: 2.5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                Total Due:
              </Text>
              <Text
                style={{
                  color: dangerColor,
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                {parseFloat(customerTotalDue).toFixed(2)}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 2.5 }}>
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: responsiveFontSize(1.7),
                }}
              >
                Final Bal
              </Text>
              <Text
                style={{
                  color: primaryColor,
                  fontSize: responsiveFontSize(1.7),
                  color:
                    totalUserAmount - customerTotalDue >= 0
                      ? primaryColor
                      : dangerColor,
                }}
              >
                {parseFloat(totalUserAmount - customerTotalDue).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.tablecontainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, { width: "19%" }]}>Date</Text>
              <Text style={[styles.headerCell, { width: "26%" }]}>
                Description
              </Text>
              <Text style={[styles.headerCell, { width: "14%" }]}>Due Amt</Text>
              <Text style={[styles.headerCell, { width: "14%" }]}>
                Paid Amt
              </Text>
              <Text style={[styles.headerCell, { width: "13%" }]}>Round</Text>
              <Text
                style={[
                  styles.headerCell,
                  {
                    width: "14%",
                    borderRightWidth: 0,
                  },
                ]}
              >
                Balance
              </Text>
            </View>
            <FlatList
              data={mergedData}
              style={{ maxHeight: responsiveHeight(28) }}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ index, item }) => {
                const orderPrice = parseFloat(item.order_price) || 0;
                const qty = parseFloat(item.qty) || 0;
                const amount = parseFloat(item.amount) || 0;
                const rounded = parseFloat(item.rounded) || 0;

                // Calculate allBalance based on the item type
                let allBalance = 0;
                if (item.type === "order") {
                  allBalance = -(orderPrice * qty);
                } else if (item.type === "payment") {
                  allBalance = amount + rounded;
                } else {
                  allBalance = 0;
                }
                // Calculate currentBalance based on the type of the item
                let currentBalance = 0;
                if (item.type === "order") {
                  currentBalance = prevBalance - (orderPrice * qty);
                } else if (item.type === "payment") {
                  currentBalance = prevBalance + (amount + rounded);
                }

                currentBalance = parseFloat(currentBalance.toFixed(2));

                prevBalance = currentBalance;
                const balanceColor = currentBalance < 0 ? dangerColor : primaryColor;
                if (index === mergedData.length - 1) {
                  setFinalBalance(currentBalance);
                }
                return (
                  <View style={styles.row}>
                    <Text style={[styles.cell, { width: "19%" }]}>
                      {format(item.date, 'dd/MM/yyyy')}
                    </Text>
                    <Text style={[styles.cell, { width: "26%" }]}>
                      {item.type === "customer"
                        ? "Opening Amount"
                        : item.remark !== "" && item.remark !== undefined
                          ? item.remark
                          : item.type === "order"
                            ? item.dress_name || "No Dress Name"
                            : "No Remark"}
                    </Text>
                    <Text style={[styles.cell, { width: "14%", color: balanceColor }]}>
                      {item.type === "order" ? (-item.order_price * item.qty) : 0}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        { width: "14%", color: primaryColor },
                      ]}
                    >
                      {
                        item.type === "customer" || item.type === "order" ? "" : parseFloat(item.amount).toFixed(2)
                      }
                    </Text>
                    <Text style={[styles.cell, { width: "13%" }]}>
                      {
                        item.type === "customer" || item.type === "order" ? "" : parseFloat(item.rounded).toFixed(2)
                      }
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        {
                          width: "14%",
                          borderRightWidth: 0,
                          color: balanceColor,
                        },
                      ]}
                    >
                      {parseFloat(currentBalance).toFixed(2)}
                    </Text>
                  </View>
                );
              }}
            />
            <View style={styles.footerRow}>
              <Text style={[styles.footerCell, { width: "45%" }]}>
                Final Balance
              </Text>
              <Text style={[styles.footerCell, { width: "14%" }]}></Text>
              <Text style={[styles.footerCell, { width: "14%" }]}></Text>
              <Text style={[styles.footerCell, { width: "13%" }]}></Text>
              <Text
                style={[
                  styles.footerCell,
                  {
                    width: "14%",
                    borderRightWidth: 0,
                    fontWeight: "bold",
                    color: finalBalance < 0 ? dangerColor : primaryColor,
                  },
                ]}
              >
                {parseFloat(finalBalance).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: responsiveHeight(2) }}>
            <Text
              style={{
                fontFamily: "SemiBold",
                fontSize: responsiveFontSize(1.8),
              }}
            >
              Payment Detail:
            </Text>
          </View>
          {
            bankDetail.length > 0 ? (
              <View
                style={[styles.totalpayment, { marginTop: responsiveHeight(1) }]}
              >
                <View
                  style={{ flex: 0, flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: responsiveWidth(25),
                      height: responsiveHeight(12),
                    }}
                  >
                    <Image
                      source={{ uri: `${pathData}/uploads/bank/${bankDetail[0].image}` }}
                      style={{ width: "100%", height: responsiveHeight(12) }}
                    />
                  </View>
                  <View style={{ marginHorizontal: responsiveWidth(3) }}>
                    <Text
                      style={{
                        fontFamily: "SemiBold",
                        fontSize: responsiveFontSize(1.6),
                      }}
                    >
                      {shopData.last_name} {shopData.first_name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SemiBold",
                        fontSize: responsiveFontSize(1.6),
                        maxWidth: responsiveWidth(47),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Bank:{""}{" "}
                      <Text style={{ fontFamily: "Regular" }}>
                        {bankDetail[0].bank_name}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SemiBold",
                        fontSize: responsiveFontSize(1.6),
                        maxWidth: responsiveWidth(50),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      AC No:{""}{" "}
                      <Text style={{ fontFamily: "Regular" }}>{bankDetail[0].ac_no}</Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: "SemiBold",
                        fontSize: responsiveFontSize(1.6),
                      }}
                    >
                      IFSC:{""}{" "}
                      <Text
                        style={{
                          fontFamily: "Regular",
                          fontSize: responsiveFontSize(1.6),
                        }}
                      >
                        {bankDetail[0].ifsc_code}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[styles.totalpayment, {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: responsiveHeight(13),
                  marginTop: responsiveHeight(1),
                  marginBottom: responsiveHeight(2)
                }]}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    opacity: 0.4,
                    fontFamily: "Regular",
                  }}
                >
                  No Bank Detail Found
                </Text>
                <TouchableOpacity
                  style={{ width: responsiveWidth(60), marginTop: responsiveHeight(1) }}
                  onPress={() => navigation.navigate("bankDetails")}
                >
                  <Text
                    style={[
                      {
                        textAlign: "center",
                        fontSize: responsiveFontSize(2),
                        borderRadius: 10,
                        padding: responsiveHeight(1),
                        color: whiteColor,
                        fontFamily: "Regular",
                        backgroundColor: primaryColor,
                      },
                    ]}
                  >
                    Add Bank Detail
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    </>
  );
};

export default GeneratePdf;
