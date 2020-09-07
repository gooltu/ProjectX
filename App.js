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
  
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
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
   
    // return unsubscribe;
    this.getStoragePermission()
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

  getStoragePermission() {
    if (Platform.OS == 'android') {
      try {
        const granted = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'JewelChat Camera Permission',
            message:
              'JewelChat needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const granted1 = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'JewelChat Storage Permission',
            message:
              'JewelChat needs access to your Storage ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const grantedStorage = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'JewelChat Permission',
            message:
              'JewelChat needs access to your Storage ' +
              'so you can use Awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (grantedStorage === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

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



