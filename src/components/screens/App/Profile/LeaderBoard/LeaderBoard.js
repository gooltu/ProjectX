import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  CameraRoll
} from "react-native";

import CustomHeader from "../../../../shared_components/customHeader/CustomHeader";
import JCImages from '../../../../../assets/JCImages'
import styles from './LeaderBoard.styles'



export default class LeaderBoard extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
      <Text>LeaderBoard</Text>
        
      </SafeAreaView>
    );
  }
}
