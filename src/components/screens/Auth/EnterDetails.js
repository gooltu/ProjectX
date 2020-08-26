import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  ActivityIndicator,
  Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'
import { Snackbar } from 'react-native-paper';
import { Form, Item, Input, Icon } from 'native-base';
import colors from "../../shared_styles/colors";
import CustomLoader from '../../shared_components/CustomLoader';
import TabIcon from "../../svg_components/TabIcons";
import actions from '../../../actions';
import db from '../../../db/localdatabase'

const teamJC = {
  _ID: 1,
  JEWELCHAT_ID: 1,
  JID: '2@jewelchat.net',
  CONTACT_NUMBER: 910000000000,
  CONTACT_NAME: 'Team JewelChat',
  PHONEBOOK_CONTACT_NAME: 'Team JewelChat',
  IS_GROUP: 0,
  STATUS_MSG: 'Keep Collecting',
  IS_REGIS: 1,
  IS_GROUP_ADMIN: 0,
  IS_INVITED: null,
  IS_BLOCKED: 0,
  IS_PHONEBOOK_CONTACT: 0,
  UNREAD_COUNT: 0,
  SMALL_IMAGE: null,
  IMAGE_PATH: 'https://parthaprofiles.s3.ap-south-1.amazonaws.com/9005835708_pic.png',
  LAST_MSG_CREATED_TIME: '1569819266669',
  MSG_TYPE: 1,
  MSG_TEXT: 'Welcome to JewelChat.'
}

class EnterDetails extends React.Component {


  state = {
    networkloading: false,
    refphone: null,
    name: null,
    snackbar: {
      visible: false,
      text: ''
    },
    buttonDisabled: false
  }

  componentDidMount() {
    this.props.loadGameData()
    db.insertTeamJC(teamJC)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log('Token', this.props.mytoken)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    //this.goBack(); // works best when the goBack is async
    return true;
  }

  onContinue() {

    if (this.state.buttonDisabled)
      return;

    this.setState({ buttonDisabled: true });
    Keyboard.dismiss();

    this.state.refphone = '91' + this.state.refphone;

    if (this.state.name && this.state.name.length == 0)
      this.state.name = null;

    if (this.state.refphone && this.state.refphone.length == 0)
      this.state.refphone = null;

    if (this.state.refphone === this.props.mytoken.myphone)
      this.state.refphone = null;

    if (this.state.refphone && this.state.refphone.length < 12)
      this.state.refphone = null;

    if (!this.state.refphone && !this.state.name)
      this.props.navigation.navigate('App')
    else {

      console.log(this.props.mytoken.cookie);
      console.log('Name:' + this.state.name);
      console.log('RefPhone:' + this.state.refphone);



      this.setState({ networkloading: true });


      axios({
        method: 'post',
        url: 'https://testjc1984.herokuapp.com/initialDetails',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: this.props.mytoken.cookie,
        },
        data: {
          name: this.state.name,
          reference: this.state.refphone
        },
      })
        .then((responseJson) => {
          this.setState({ networkloading: false })
          console.log(responseJson);
          if (!responseJson.data.error) {
            this.props.navigation.navigate('App')
          } else
            throw (new Error(responseJson.message))
        })
        .catch((error) => {
          console.log(error)
          this.setState({ networkloading: false })
          let s = { visible: true, text: error.message }
          this.setState({ snackbar: s });
          this.setState({ buttonDisabled: false });
        });

    }


  }

  render() {
    return (

      <View style={{ backgroundColor: colors.darkcolor1, width: '100%', height: '100%', paddingLeft: 40, paddingRight: 40, alignItems: 'center' }} >
        <CustomLoader loading={this.state.networkloading} />
        <View style={styles.headingview}>
          <Text style={styles.heading}>Enter Details</Text>
        </View>
        <Form style={{ width: 250, marginBottom: 30, marginRight: 20 }}>
          <Item style={{ borderColor: colors.lightcolor2 }}>
            <Input
              placeholder='name'
              placeholderTextColor={colors.jcgray}
              getRef={(input) => this.otp = input}
              numberOfLines={1}
              maxLength={20}
              onChangeText={(val) => { this.state.name = val }}
              style={{ color: colors.lightcolor1, textAlign: 'center' }} />
          </Item>
        </Form>

        <Form style={{ width: 250, marginRight: 20 }}>
          <Item style={{ borderColor: colors.lightcolor2 }}>
            <TabIcon
              name="NineOne"
              fill={colors.lightcolor1}
              height="30"
              width="30"
            />
            <Input
              placeholder='referrer mobile number'
              placeholderTextColor={colors.jcgray}
              keyboardType='phone-pad'
              numberOfLines={1}
              maxLength={10}
              onChangeText={(val) => { this.state.refphone = val }}
              style={{ color: colors.lightcolor1, textAlign: 'center' }} />
          </Item>
        </Form>



        <TouchableOpacity style={styles.button} onPress={() => this.onContinue()} >
          <ImageBackground source={require('../../../assets/ColorGrad.jpg')} style={{
            width: '100%', height: '100%', justifyContent: 'center',
            alignItems: 'center', overflow: 'hidden'
          }}>
            <Text style={styles.buttontext}> Continue </Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('App')}>
          <Text style={{ marginTop: 15, fontSize: 16, color: colors.lightcolor1, width: '100%', textAlign: "center" }}>SKIP</Text>
        </TouchableOpacity>

      </View>


    );
  }

}


function mapStateToProps(state) {
  return {
    mytoken: state.mytoken
  }
}



function mapDispatchToProps(dispatch) {
  return {
    tokenLoad: (myTokens) => dispatch({ type: 'USER_TOKEN_LOADED', myTokens }),
    loadGameData: () => dispatch(actions.loadGameState())

  }
}




export default connect(mapStateToProps, mapDispatchToProps)(EnterDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: colors.darkcolor1
  },
  headingview: {
    marginTop: 100,
    marginBottom: 35,
    width: '100%',
    alignItems: "center"
  },
  heading: {
    color: 'white',
    fontSize: 24,
    fontWeight: "600"
  },
  textview: {
    flexDirection: 'row',
    marginTop: 40,
    width: '60%',
    height: 20
  },
  button: {
    height: 50,
    width: 250,
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 60,
    backgroundColor: colors.lightcolor1,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#00000000',
    overflow: 'hidden'
  },
  buttontext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "600"
  }
});