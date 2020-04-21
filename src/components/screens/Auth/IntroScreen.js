import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native";


import colors from "../../shared_styles/colors";

import XMPP from "../../../utilities/xmpp/strophe";
import { hidden } from "ansi-colors";


export default class IntroScreen extends React.Component {
  
  WEBSOCKET_SERVICE = 'ws://13.233.85.150:5280/ws-xmpp';
  connection = null;

  rawInput = (data) =>
  {
        console.log('RECV', data);
  }

  rawOutput = (data) => 
  {
      console.log('SENT', data);
  }
  
  onConnect = (status, err) =>{
          if(err)
          console.log('Error:'+err);

          if (status == Strophe.Status.CONNECTING) {
            console.log('Strophe is connecting.');
          } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect.');        
          } else if (status == Strophe.Status.AUTHENTICATING) {
            console.log('Strophe is authenticating.');
          } else if (status == Strophe.Status.AUTHFAIL) {
            console.log('Strophe is auth failure.');
          } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting.');
          } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected.');        
          } else if (status == Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
            console.log('ECHOBOT: Send a message to ' + connection.jid + 
            ' to talk to me.');
          }
  }        


  xmpp = () => {
    
    console.log(document);
    console.log(DOMParser);

    connection = new XMPP.Strophe.Connection(this.WEBSOCKET_SERVICE);
    connection.rawInput = this.rawInput;
    connection.rawOutput = this.rawOutput;
    connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;

    connection.connect('user1@jewelchat', 'pass', this.onConnect);
    

    //console.log(XMPP.Strophe);

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: 400, height: 400 }} />

        <TouchableOpacity style={styles.button} onPress = {() => this.props.navigation.navigate('RegisterPhone', {name: 'Jane'})} >
            <ImageBackground source={require('../../../assets/ColorGrad.jpg')} style={{width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center', overflow:'hidden'}}>
                <Text style= {styles.buttontext}> Start Chatting </Text>
            </ImageBackground> 
        </TouchableOpacity>     
        


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
    height: 50,
    width: 250,
    alignItems: "center",    
    marginRight:40,
    marginLeft:40,
    marginTop:100,
    /*
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    */
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
