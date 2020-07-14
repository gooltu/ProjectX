import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  ImageBackground,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import colors from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'

export default class JewelFactory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curTime: ''
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        curTime: new Date().getTime() - new Date().getTime()
      })
    }, 1000)
  }
  // curTime(date){
  //   setInterval(() => {
  //   this.setState({
  //     curTime: new Date(date).getTime() - new Date().getTime()
  //   })
  // }, 1000)
  // return this.state.curTime
  // }
  render() {
    return (
      <View style={{ backgroundColor: colors.darkcolor1, height: '100%', width: '100%' }}>
        <View style={{ marginHorizontal: 10, marginVertical: 5, height: 250, backgroundColor: colors.darkcolor3 }}>
          <View style={{ marginHorizontal: 5, marginVertical: 5, height: 120, backgroundColor: colors.darkcolor1 }}>
          </View>
          <View>
            {/* <Text>Date: {this.curTime('2020-07-11 23:59:59')}</Text>
            <Text>Date: {this.curTime('2020-07-21 23:59:59')}</Text> */}
        </View>
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}  >
            <View style={{ width: 150, height: 40, zIndex: 1, backgroundColor: colors.darkcolor3, borderColor: colors.darkcolor3, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
              <View style={{ width: "100%", height: '100%' }}>
                <ImageBackground source={JCImages.colorGrad} style={{
                  width: '100%', height: '100%', justifyContent: 'center',
                  alignItems: 'center', overflow: 'hidden'
                }}></ImageBackground>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => console.log('add money')}
              style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>START</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
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