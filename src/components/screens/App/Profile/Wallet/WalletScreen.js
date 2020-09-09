import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import styles from './Wallet.styles'
import NetworkManager from "../../../../../network/NetworkManager";
import rest from "../../../../../network/rest";
import { connect } from "react-redux";
import actions from "../../../../../actions";
import { renderJewel } from "../../../../JCUtils/CommonUtils";
import CustomLoader from "../../../../shared_components/CustomLoader";


class WalletScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      money: 0,
      isLoading: false
    }
  }

  componentDidMount() {
    this.props.getWalletJewels()
    NetworkManager.callAPI(rest.getWallet, 'GET', null).then(result => {
      this.setState({
        money: result.money
      })
    }).catch(error => {

    })
  }

  redeemWalletMoney = (channel) => {
    if (this.state.money > 0) {
      this.setState({
        isLoading: true
      })
      NetworkManager.callAPI(rest.redeemMoney, 'POST', { 'channel': channel }).then(result => {
        console.log(result)
        this.setState({
          money: 0,
          isLoading: false
        })
        this.props.naviation.navigate('SuccessFullGiftRedeem')
      }).catch(error => {

      })
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <CustomLoader loading={this.state.isLoading} />
        <View style={styles.addMoneyContainer}>
          <View>
            <Text style={styles.MoneyText}>{'\u20B9'} {this.state.money}</Text>
          </View>
          {/* <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}  >
                <View style={{ width: 160, height: 45, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
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
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>+ Add Money</Text>
                </TouchableOpacity>
              </TouchableOpacity> */}
          {/* <Button style={{ backgroundColor: '#5a98fb' }}>
            <Text style={styles.addMoneyText}>+ Add Money</Text>
          </Button> */}
        </View>

        <View style={styles.transferMoneyContainer}>
          <View style={styles.transferTextContainer}>
            <Text style={styles.transferText}>TRANSFER{"\n"} MONEY</Text>
          </View>

          <View style={styles.paymentOptionConatiner}>
            <TouchableOpacity style={styles.transferOptionContainer} onPress={() => this.redeemWalletMoney('PAYTM')}>
              <Text style={styles.optionText}>PAYTM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer} onPress={() => this.redeemWalletMoney('PHONEPAY')}>
              <Text style={styles.optionText}>PHONEPE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer} onPress={() => this.redeemWalletMoney('UPI')}>
              <Text style={styles.optionText}>UPI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transferOptionContainer} onPress={() => this.redeemWalletMoney('GAPY')}>
              <Text style={styles.optionText}>GPAY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.props.walletjewels.length > 0 ?
          <View>
            <View style={{ paddingTop: 15 }}>
              <View style={styles.diamondContainer}>
                <Text style={styles.buyText}>BUY DIAMONDS</Text>
              </View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                  this.props.walletjewels.slice(0, this.props.walletjewels.length / 2).map((object) => (
                    <View style={styles.scrollBar}>
                      <TouchableOpacity style={styles.scrollBarItem}>
                        <View style={styles.itemOne}>
                          <Text style={styles.itemText}>{object.count}</Text>
                          {renderJewel(object.jeweltype_id, 55, 55, styles.jewelStyle)}
                        </View>
                        <View style={styles.itemTwo}>
                          <Text></Text>
                          <Text style={styles.itemText}>{'\u20B9'} {object.money}</Text>
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
                  this.props.walletjewels.slice(this.props.walletjewels.length / 2, this.props.walletjewels.length).map((object) => (
                    <View style={styles.scrollBar}>
                      <TouchableOpacity style={styles.scrollBarItem}>
                        <View style={styles.itemOne}>
                          <Text style={styles.itemText}>{object.count}</Text>
                          {renderJewel(object.jeweltype_id, 55, 55, styles.jewelStyle)}
                        </View>
                        <View style={styles.itemTwo}>
                          <Text></Text>
                          <Text style={styles.itemText}>{'\u20B9'} {object.money}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </ScrollView>
            </View>
          </View>
          : null}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    walletjewels: state.walletjewels.prices
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getWalletJewels: () => dispatch(actions.getWalletJewels())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)