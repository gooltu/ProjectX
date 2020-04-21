/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { StatusBar, PermissionsAndroid, Platform } from "react-native";
import JewelChat from "./src/components/JewelChat";
import { store, persistor } from './src/store';
import { Provider } from 'react-redux';
import colors from "./src/components/shared_styles/colors";
import { PersistGate } from 'redux-persist/integration/react';

//useScreens();

export default class App extends React.Component {
  componentDidMount() {
    this.getStoragePermission()
  }

  getStoragePermission() {
    if (Platform.os == 'android') {
      try {
        // const granted = PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.CAMERA,
        //   {
        //     title: 'JewelChat Camera Permission',
        //     message:
        //       'JewelChat needs access to your camera ' +
        //       'so you can take awesome pictures.',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        //   },
        // );
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



