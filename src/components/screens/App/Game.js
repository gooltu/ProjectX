import React from 'react'
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
    Text
  } from 'react-native';


export default class Game extends React.Component {
    
    render() {
      return (
        <View>
          <Text>Game</Text>
          <StatusBar barStyle="light-content" hidden={false} translucent={true} />
        </View>
      );
    }

  }