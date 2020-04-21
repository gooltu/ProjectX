import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text
} from "react-native";



export default class Contacts extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/

  render() {
    return (
      <View>
        <Text>Contacts</Text>
        <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      </View>
    );
  }
}
