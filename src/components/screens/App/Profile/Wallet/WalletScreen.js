import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  CameraRoll
} from "react-native";

import CustomHeader from "../../../../shared_components/customHeader/CustomHeader";
import JCImages from '../../../../../assets/JCImages'
import { Button } from 'native-base'
import color from '../../../../shared_styles/colors'
import styles from './Wallet.styles'
import Logo from '../../../../svg_components/Logo';
import Diamond from '../../../../svg_components/Diamond';
import Coin from '../../../../svg_components/Coin';

const scrollBarData = [
  {
    'image': JCImages.wallet,
    'text': 'WALLET'
  },
  {
    'image': JCImages.trophy,
    'text': 'LEADERBOARD'
  },
  {
    'image': JCImages.setting,
    'text': 'SETTINGS'
  },
  {
    'image': JCImages.share,
    'text': 'SHARE'
  }
]


export default class WalletScreen extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/


  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.addMoneyContainer}>
          <View style={{ paddingLeft: 40 }}>
            <Text style={styles.MoneyText}>{'\u20B9'} 1000</Text>
          </View>
          <Button style={{ backgroundColor: '#5a98fb' }}>
            <Text style={styles.addMoneyText}>+ Add Money</Text>
          </Button>
        </View>

        <View style={styles.transferMoneyContainer}>
          <View style={styles.transferTextContainer}>
            <Text style={styles.transferText}>TRANSFER{"\n"} MONEY</Text>
          </View>

          <View style={styles.paymentOptionConatiner}>
            <TouchableOpacity style={styles.transferOptionContainer}>
              <Text style={styles.optionText}>PAYTM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer}>
              <Text style={styles.optionText}>PHONEPE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer}>
              <Text style={styles.optionText}>UPI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer}>
              <Text style={styles.optionText}>GPAY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingTop: 15 }}>
          <View style={styles.diamondContainer}>
            <Text style={styles.buyText}>BUY DIAMONDS</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              scrollBarData.map((object) => (
                <View style={styles.scrollBar}>
                  <TouchableOpacity style={styles.scrollBarItem}>
                    <View style={styles.itemOne}>
                      <Text style={styles.itemText}>100</Text>
                      <Diamond height="55" width="55" />
                    </View>
                    <View style={styles.itemTwo}>
                      <Text></Text>
                      <Text style={styles.itemText}>{'\u20B9'} 2000</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View style={{ paddingTop: 15 }}>
          <View style={styles.diamondContainer}>
            <Text style={styles.buyText}>BUY COINS</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              scrollBarData.map((object) => (
                <View style={styles.scrollBar}>
                  <TouchableOpacity style={styles.scrollBarItem}>
                    <View style={styles.itemOne}>
                      <Text style={styles.itemText}>100</Text>
                      <Coin height="55" width="55" />
                    </View>
                    <View style={styles.itemTwo}>
                      <Text></Text>
                      <Text style={styles.itemText}>{'\u20B9'} 2000</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
