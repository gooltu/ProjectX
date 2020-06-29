import React from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
  PixelRatio
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import CustomHeader from "../../../shared_components/customHeader/CustomHeader";
import styles from './Profile.styles'
import strings from './Profiles.strings'
import color from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import { connect } from 'react-redux';
import Diamond from '../../../svg_components/Diamond'
import Coin from '../../../svg_components/Coin'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon1 from 'react-native-vector-icons/Ionicons'
import rest from "../../../../network/rest";
import NetworkManager from "../../../../network/NetworkManager";
import { renderJewel } from "../../../JCUtils/CommonUtils";
import actions from "../../../../actions";

const scrollBarData = [
  {
    'image': <Icon name='wallet' size={35} color='white' />,
    'text': 'WALLET'
  },
  {
    'image': <Icon name='trophy' size={35} color='white' />,
    'text': 'LEADERBOARD'
  },
  {
    'image': <Icon1 name='md-settings' size={35} color='white' />,
    'text': 'SETTINGS'
  },
  {
    'image': <Icon name='share-alt' size={35} color='white' />,
    'text': 'SHARE'
  }
]
class Profile extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/
  constructor(props) {
    super(props)
    this.state = {
      imagepath: '',
      userProfile: {
        name: 'test'
      }
    }
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.loadProfilePicture()
    })
    this.getAchievements()
  }
  getAchievements = () => {
    if (!this.props.userachievements.length > 0)
      NetworkManager.callAPI(rest.getUsersAchievement, 'POST', null).then(result => {
        this.props.setUserAchievement(result.userachievements)
      }).catch(error => {

      })
    //if (!this.props.achievements.length > 0)
      NetworkManager.callAPI(rest.getAchievements, 'POST', null).then(result => {
        this.props.setAchievements(result.achievements)
      }).catch(error => {

      })
      NetworkManager.callAPI(rest.getChildren, 'GET', null).then(result => {
    //    this.props.setAchievements(result.achievements)
      }).catch(error => {

      })
  }
  loadProfilePicture = () => {
    AsyncStorage.multiGet(["UserProfileImage", "UserProfile"]).then(profileData => {
      if (profileData[0][1] && profileData[1][1]) {
        this.setState({
          imagepath: profileData[0][1],
          userProfile: JSON.parse(profileData[1][1]),
        })
      }
      else {
        var data = {
          'phone': '918756463536'
        }
        NetworkManager.callAPI(rest.downloadContact_Phone, 'post', data).then((responseJson) => {
          console.log(responseJson)
          if (responseJson.error == false) {
            this.setState({
              userProfile: responseJson.contact
            })
            AsyncStorage.setItem('UserProfileImage', responseJson.contact.large_pic)
            AsyncStorage.setItem('UserProfile', JSON.stringify(responseJson.contact))
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    })
  }
  getPercentage(item) {
    if (item.text.includes('img')) {
      let jewel = parseInt(item.text.replace(/\D/g, ''))
      let percent = (this.props.game.jewels[jewel].total_count) / (this.props.game.scores.level * 5)
      if (percent > 1) {
        return 100
      }
      else {
        return percent * 100
      }
    }
    else
      return 10
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  scrollBarNaviagtion(text) {
    if (text === 'LEADERBOARD') {
      this.props.navigation.navigate("LeaderBoard")
    }
    if (text === 'WALLET') {
      this.props.navigation.navigate("Wallet")
    }
    if (text === 'SETTINGS') {
      this.props.navigation.navigate("UserProfile")
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 40 }}>
            <View style={styles.profileSection}>
              <View style={styles.firstDiamond}>
                <View style={styles.mainLeftLayout}>
                  <Diamond width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                  <Text style={{ color: 'white' }}>{this.props.game.jewels[0].count}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')}>
                <Image style={styles.ProfilePicture} key={this.state.imagepath} resizeMode="contain" source={this.state.imagepath ? { uri: this.state.imagepath } : JCImages.placeholderImage} />
              </TouchableOpacity>
              <View style={styles.SecondDiamond}>
                <View style={styles.mainRightLayout}>
                  <Coin width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                  <Text style={{ color: 'white' }}>{this.props.game.jewels[1].count}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ color: 'white' }}>{this.state.userProfile.name}</Text>
          </View>
          <View style={{ paddingBottom: 20, alignItems: 'center' }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                scrollBarData.map((object) => (
                  <View style={styles.scrollBar}>
                    <TouchableOpacity style={styles.scrollBarItem} onPress={() => this.scrollBarNaviagtion(object.text)}>
                      {/* <Image style={styles.itemImage} source={object.image} /> */}
                      {object.image}
                      <Text style={styles.itemText}>{object.text}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </ScrollView>
          </View>
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
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', paddingRight: 10 }}>{item.text.split('<x>')[0]} 5</Text>
                            {renderJewel(item.text.replace(/\D/g, ''), 30, 35, styles.jewelStyle)}
                          </View>
                          :
                          <Text style={{ color: 'white' }}>{item.text.replace('<x>', '5')}</Text>}
                      </View>
                      <View style={{ width: '100%', height: 5, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 3, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                        <View style={{ width: "" + this.getPercentage(item) + "%", height: '100%' }}>
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
                          <TouchableOpacity style={{ backgroundColor: color.lightcolor2, height: 22, width: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
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
  console.log('state.achievements.achievements',state.userachievements.userachivements)
  return {
    userachievements: state.userachievements.userachivements,
    achievements: state.achievements.achievements,
    game: state.game
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setAchievements: (payload) => dispatch(actions.setAchievements(payload)),
    setUserAchievement: (payload) => dispatch(actions.setUserAchievement(payload))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
