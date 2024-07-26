import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles, whiteColor } from '../styles/style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Add = ({ routeName, params }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.addmaincontainer}>
      <TouchableOpacity onPress={() => navigation.navigate(routeName, params)}>
        <View style={styles.innercontainer}>
          <Text style={styles.pluscomptext}>
            <Ionicons
              name="add-outline"
              size={35}
              color={whiteColor}
            />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Add;
