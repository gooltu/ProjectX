import React from 'react'
import {  
  StyleSheet,
  View,
  Text,  
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';

import { Snackbar } from 'react-native-paper';

import { connect } from 'react-redux';  
import AsyncStorage from '@react-native-community/async-storage';

import { Form, Item, Input } from 'native-base';
import colors from "../../shared_styles/colors";
import CustomLoader from '../../shared_components/CustomLoader';
import axios from 'axios'
import { createDatabaseTables } from "../../../db/localdatabase";
import actions from '../../../actions';


class EnterOTP extends React.Component {


  state = {
    networkloading:false,
    phone: '',
    userId: '',
    otp: '',
    snackbar: {
      visible: false,
      text: ''
    },
    buttonDisabled: false,
    resendText: 'Resend OTP',
    resendTimes: 1
  }

  

  

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.state.phone =  this.props.navigation.getParam('phone');
    this.state.userId = this.props.navigation.getParam('userId');
    console.log('PHONE', this.props.navigation.getParam('phone'))
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {    
    return true;
  }

  

  resendOTP(){
    if(this.state.resendTimes<3){
      this.setState({ networkloading: true })  
      axios({
        method: 'post',
        url: 'https://testjc1984.herokuapp.com/resendVcode', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userId: this.state.userId          
        },
      })
      .then((responseJson) => {
        this.setState({ networkloading: false })
        if(!responseJson.data.error){
          if(this.state.resendTimes == 1)  
            this.setState({resendText: 'Resend OTP one more time', resendTimes: 2})
          else
          this.setState({resendText: '', resendTimes: 3})
          
        }else
          throw(new Error(responseJson.message))  
      })
      .catch((error) => {
        this.setState({ networkloading: false })
        let s = {visible: true, text: error.message} 
        this.setState( { snackbar: s } );  
        this.setState({ buttonDisabled: false });
      });


    }

  }

  onContinue(){
    console.log('Continue',this.state.userId);

    if(this.state.buttonDisabled)
      return;
    
    this.setState(  { buttonDisabled: true } );
    Keyboard.dismiss();
    console.log('Here', this.state.otp.length)   
    if(this.state.otp.length !== 6 ){
      let s = {visible: true, text: 'Enter valid 6 digit OTP.'} 
      this.setState( { snackbar: s } );  
      this.setState(  { buttonDisabled: false } );
    }else{
      // Loader modal
      //network call
      this.setState({ networkloading: true })
      axios({
        method: 'post',
        url:'https://testjc1984.herokuapp.com/verifyCode', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userId: this.state.userId,
          verificationCode: this.state.otp
        },
      })
      .then((response) => {
        console.log(response)
        let responseheader = response.headers;
        console.log(responseheader)
        let cookie = responseheader["jc-cookie"];
        global.cookie = cookie
        console.log(cookie)
        let token = cookie.split('=')[1];
        console.log(token)
        let myTokens = {
          myid: this.state.userId,
          myphone: this.state.phone,
          cookie,
          token
        };

        AsyncStorage.multiSet([ ['myid',myTokens.myid+''],['myphone',myTokens.myphone],['token',myTokens.token],['cookie', myTokens.cookie] ])
        .then( () => {

          this.props.tokenLoad(myTokens);
        })
        this.setState({ networkloading: false })
        if(!response.data.error){
          this.props.navigation.navigate('EnterDetails', response.data);
          this.props.loadGameData()
        }else
          throw(new Error(error.message))  
      })
      .catch((error) => {
        this.setState({ networkloading: false })
        let s = {visible: true, text: error.message} 
        this.setState( { snackbar: s } );  
        this.setState({ buttonDisabled: false });
      });


    }
      
    
  }

  render() {
    return (
      
      <View style={{backgroundColor:colors.darkcolor1, width:'100%', height:'100%', paddingLeft: 40, paddingRight: 40, alignItems:'center'}} >  
          <CustomLoader loading = {this.state.networkloading} />
          <View style = {styles.headingview}> 
              <Text style={styles.heading}>Enter OTP</Text>
          </View>
          <Form style={{ width: 250, marginBottom:30, marginRight:20 }}>
              <Item  style={{ borderColor: colors.lightcolor2 }}>                      
              <Input 
                placeholder='XXXXXX ' 
                placeholderTextColor = {colors.jcgray}                
                keyboardType = 'phone-pad'
                numberOfLines = {1}
                maxLength = {6} 
                onChangeText={(val) => { this.state.otp = val }} 
                style={{color:colors.lightcolor1, textAlign: 'center' }} />
            </Item>            
          </Form>
          
          <TouchableOpacity onPress = {() => this.resendOTP()}> 
              <Text style={{fontSize:12, color: colors.lightcolor1, width: '100%', textAlign: "center"}}>{this.state.resendText}</Text>
          </TouchableOpacity>         

          <TouchableOpacity style={styles.button} onPress = {() => this.onContinue()} >
                                                  
            <ImageBackground source={require('../../../assets/ColorGrad.jpg')} style={{width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center', overflow:'hidden'}}>
                <Text style= {styles.buttontext}> Continue </Text>
            </ImageBackground> 
          </TouchableOpacity>

          <Snackbar          
            visible={this.state.snackbar.visible}
            onDismiss={() => this.setState( { snackbar: { visible: false, text: '' }} )}          
          >
            {this.state.snackbar.text}
          </Snackbar>
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
    tokenLoad: (myTokens) => dispatch({ type:'USER_TOKEN_LOADED', myTokens }),
    loadGameData: () => dispatch(actions.loadGameState())
    //createTables: () => dispatch(createDatabaseTables()),
	}
}




export default connect(mapStateToProps, mapDispatchToProps )(EnterOTP);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: colors.darkcolor1
  },
  headingview:{
    marginTop:100,
    marginBottom: 35,
    width:'100%',
    alignItems: "center"
  },
  heading: {
    color: 'white',
    fontSize: 24,
    fontWeight: "600"
  },
  textview:{    
    flexDirection: 'row',    
    marginTop:40,
    width: '60%',
    height: 20
  },
  button: {
    height: 50,
    width: 250,
    alignItems: "center",    
    marginRight:30,
    marginLeft:30,
    marginTop:60,    
    backgroundColor: colors.lightcolor1,
    borderRadius:10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#00000000',
    overflow:'hidden'    
  },
  buttontext: {
    color: 'white',
    textAlign:'center',
    fontSize: 18,
    fontWeight: "600"
  }
});