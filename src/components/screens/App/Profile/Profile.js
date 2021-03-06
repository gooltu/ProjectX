import React from "react";
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";

import styles from './Profile.styles'
import color from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import { connect } from 'react-redux';
import Diamond from '../../../svg_components/Diamond'
import rest from "../../../../network/rest";
import NetworkManager from "../../../../network/NetworkManager";
import { renderJewel } from "../../../JCUtils/CommonUtils";
import actions from "../../../../actions";
import colors from "../../../shared_styles/colors";
import ProfileOptionsList from './ProfileOptionsList'
import ProfilePhotoSection from './ProfilePhotoSection'
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      referrals: {}
    }
  }
  componentDidMount() {
    this.getAchievements()
  }
  getAchievements = () => {
    if (!this.props.userachievements.length > 0)
      NetworkManager.callAPI(rest.getUsersAchievement, 'POST', null).then(result => {
        this.props.setUserAchievement(result.userachievements)
      }).catch(error => {

      })
    if (!this.props.achievements.length > 0)
      NetworkManager.callAPI(rest.getAchievements, 'POST', null).then(result => {
        this.props.setAchievements(result.achievements)
      }).catch(error => {

      })
    NetworkManager.callAPI(rest.getChildren, 'GET', null).then(result => {
      this.setState({
        referrals: result
      })
    }).catch(error => {

    })
  }
  getPercentage(item, index) {
    if (item.text.includes('img')) {
      let jewel = parseInt(item.text.replace(/\D/g, ''))
      let percent = (this.props.game.jewels[jewel].total_count) / (this.props.userachievements[index].level * 10)
      if (percent > 1) {
        return 100
      }
      else {
        return percent * 100
      }
    }
    else if (item.text.includes('successfully')) {
      let percent = (this.props.game.jewels[2].total_count) / (this.props.userachievements[index].level * 5)
      if (percent > 1) {
        return 100
      }
      else {
        return percent * 100
      }
    }
    return 100
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  redeemAchievements = (item, index) => {
    if (this.getPercentage(item, index) == 100) {
      let data = {
        id: this.props.userachievements[index].id
      }
      NetworkManager.callAPI(rest.redeemAchievement, 'POST', data).then(result => {
        NetworkManager.callAPI(rest.getUsersAchievement, 'POST', null).then(results => {
          this.props.setUserAchievement(results.userachievements)
          this.props.loadGameState()
          this.props.navigation.navigate('SuccessFullGiftRedeem')
        }).catch(error => {

        })
      }).catch(error => {

      })
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfilePhotoSection navigation={this.props.navigation} />
          <ProfileOptionsList navigation={this.props.navigation} />

          <View style={styles.diamondContainer} >
            <Text style={styles.buyText}>WIN GAME DIAMONDS</Text>
          </View>
          {this.props.achievements.length > 0 && this.props.userachievements.length > 0 ?
            <FlatList
              scrollEnabled={false}
              data={this.props.achievements}
              renderItem={({ item, index }) =>
                <View>
                  <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '75%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ padding: 5 }}>
                        {item.text.includes('img') ?
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: 'white', paddingRight: 10 }}>{item.text.split('<x>')[0]} 5</Text>
                            {renderJewel(item.text.replace(/\D/g, ''), 30, 35, styles.jewelStyle)}
                          </View>
                          :
                          <Text style={{ color: 'white' }}>{item.text.replace('<x>', '5')}</Text>}
                      </View>
                      <View style={{ width: '100%', height: 5, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 3, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                        <View style={{ width: "" + this.getPercentage(item, index) + "%", height: '100%' }}>
                          <ImageBackground source={JCImages.colorGrad} style={{
                            width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center', overflow: 'hidden'
                          }}></ImageBackground>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 5 }}>
                        <Text style={{ color: 'white', paddingRight: 5, fontSize: 16 }}>{item.diamond}</Text>
                        <Diamond height='20' width='20' />
                      </View>
                      {
                        this.props.game.scores.level >= this.props.userachievements[index].level ?
                          <TouchableOpacity onPress={() => this.redeemAchievements(item, index)} disabled={this.getPercentage(item, index) == 100 ? false : true} style={{ backgroundColor: this.getPercentage(item, index) == 100 ? color.lightcolor2 : colors.darkcolor1, borderColor: colors.lightcolor2, borderWidth: 1, height: 22, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>WIN</Text>
                          </TouchableOpacity> :
                          <TouchableOpacity style={{ backgroundColor: color.darkcolor1, height: 22, width: 65, alignItems: 'center', borderColor: color.lightcolor2, justifyContent: 'center', borderWidth: 1.5, borderRadius: 5 }}>
                            <Text style={{ color: color.jcgray, fontSize: 12 }}>LEVEL {this.props.userachievements[index].level}</Text>
                          </TouchableOpacity>
                        // console.log(this.props.userachievements, index)
                      }
                    </View>
                  </View>
                  <View style={{ backgroundColor: color.darkcolor3, height: 0.4, width: '100%' }}></View>
                </View>
              }
              keyExtractor={item => item.id}
            /> : null}

          <StatusBar barStyle="light-content" hidden={false} translucent={true} />
        </ScrollView>
      </SafeAreaView >
    );
  }
}

function mapStateToProps(state) {
  console.log('state.achievements.achievements', state.userachievements.userachivements)
  return {
    userachievements: state.userachievements.userachivements,
    achievements: state.achievements.achievements,
    game: state.game
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setAchievements: (payload) => dispatch(actions.setAchievements(payload)),
    setUserAchievement: (payload) => dispatch(actions.setUserAchievement(payload)),
    loadGameState: () => dispatch(actions.loadGameState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
