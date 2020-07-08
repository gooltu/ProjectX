import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import colors from '../../../shared_styles/colors'

export default class JewelFactory extends React.Component {

  render() {
    return (
      <View style={{ backgroundColor: colors.darkcolor1, height: '100%', width: '100%' }}>
        <Text>JewelFactory</Text>

        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.goBack()} >
          <Text style={styles.buttontext}>Go Back </Text>
        </TouchableOpacity>
        <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: colors.darkcolor1
  },
  button: {
    alignItems: "center",
    marginRight: 40,
    marginLeft: 40,
    marginTop: 40,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.lightcolor2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.lightcolor2
  },
  buttontext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "600"
  }
});