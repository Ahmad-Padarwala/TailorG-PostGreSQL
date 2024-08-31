import React from 'react';
import {
    Text,
    View,
    Linking,
    TouchableOpacity
} from "react-native";
import { styles, primaryColor, whiteColor, dangerColor } from "../../styles/style";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
    responsiveHeight,
    responsiveWidth,
} from "react-native-responsive-dimensions";
import HomeStack from '../../navigation/HomeStack';

const HelpPage = () => {
    const navigation = useNavigation();
    const Whatsapp = (e) => {
        Linking.openURL(`whatsapp://send?text=Hello&phone=+91${9151715158}`);
    };

    const Phone = (e) => {
        Linking.openURL(`tel:${9151715158}`);
    };

    const Email = (e) => {
        Linking.openURL(`mailto:support@tailorg.com`);
    };
    return (
        <>
            <View style={[styles.backPRofileIcon, { flex: 0, flexDirection: "row" }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: "40%" }}
                >
                    <Ionicons
                        name="arrow-back-outline"
                        size={20}
                        style={{
                            marginHorizontal: responsiveWidth(3),
                            marginTop: responsiveHeight(2.3),
                        }}
                    />
                </TouchableOpacity>
                <View style={{ width: "60%" }}>
                    <Text style={styles.profileTitle}>Contact Us</Text>
                </View>
            </View>
            <View style={[styles.flatlistheader]}>
                <View>
                    <Text style={styles.customerName}>Feel free to contact for any kind of support.</Text>
                </View>
                <TouchableOpacity
                    style={styles.customerMain}
                    onPress={Phone}
                >
                    <View style={{ flex: 0, flexDirection: "row" }}>

                        <View
                            style={{
                                marginHorizontal: responsiveWidth(0),
                                flex: 0,
                                justifyContent: "center",
                                marginTop: responsiveHeight(0.8),
                            }}
                        >
                            <Text style={styles.label}>Contact / Whatsapp</Text>
                            <View>
                                <Text style={styles.customerName}>
                                    9151715158
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 0,
                            flexDirection: "row",
                            marginTop: responsiveHeight(4.6),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Phone();
                            }}
                        >
                            <Ionicons
                                name="call"
                                size={20}
                                style={{ marginHorizontal: responsiveWidth(3) }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Whatsapp();
                            }}
                        >
                            <Ionicons
                                name="logo-whatsapp"
                                size={20}
                                color={primaryColor}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity >


                <TouchableOpacity
                    style={styles.customerMain}
                    onPress={Email}
                >
                    <View style={{ flex: 0, flexDirection: "row" }}>

                        <View
                            style={{
                                marginHorizontal: responsiveWidth(0),
                                flex: 0,
                                justifyContent: "center",
                                marginTop: responsiveHeight(0.8),
                            }}
                        >
                            <Text style={styles.label}>Email</Text>
                            <View>
                                <Text style={styles.customerName}>
                                    support@tailorg.com
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 0,
                            flexDirection: "row",
                            marginTop: responsiveHeight(4.6),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Email();
                            }}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={primaryColor}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity >

                <View>
                    <Text style={[styles.customerName, { marginTop: responsiveHeight(7), color: dangerColor }]}>We are currently preparing helpful videos about this app. Please check back soon to learn more and see how it works.</Text>
                </View>
            </View >

        </>
    )
}

export default HelpPage
