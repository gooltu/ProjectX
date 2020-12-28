/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import { StatusBar, PermissionsAndroid, Platform, Alert } from "react-native";
import JewelChat from "./src/components/JewelChat";
import { store, persistor } from './src/store';
import { Provider } from 'react-redux';
import colors from "./src/components/shared_styles/colors";
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    global.Contacts = []
    global.TimeDelta = 0
    global.cookie = ''
  }
  componentDidMount() {
  
    
    this.handleBackgroundState = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      //navigation.navigate(remoteMessage.data.type);
    });
    this.setBackgroundMessageHandler = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });


    // Check whether an initial notification is available
    this.handleQuitState = messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });   
    
    console.log(this.getFCMToken())
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('testy')
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    console.log(messaging())
  }

  componentWillUnmount() {
  //  this.messageListener();
  }
  getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token', token)
      if (token) return token;
    } catch (error) {
      console.log(error);
    }
  };

  getFCMToken = async () => {
    try {
      const authorized = await messaging().hasPermission();
      const fcmToken = await this.getToken();

      if (authorized) return fcmToken;

      messaging().requestPermission().then(() => {
        Alert.alert("User Now Has Permission")
      })
        .catch(error => {
          Alert.alert("Error", error)
          // User has rejected permissions  
        });
      return fcmToken;
    } catch (error) {
      console.log(error);
    }
  };  

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar backgroundColor={colors.darkcolor2} barStyle="light-content" hidden={false} translucent={true} />
          <JewelChat />
        </PersistGate>
      </Provider>

    );
  }


}



