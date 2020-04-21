import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  PixelRatio
} from "react-native";

import CustomHeader from "../../../shared_components/CustomHeader";
import styles from './Profile.styles'
import strings from './Profiles.strings'
import color from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import Logo from '../../../svg_components/Logo';
import Diamond from '../../../svg_components/Diamond'
import { Button } from 'react-native-paper'


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
class Profile extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log("xyghijlhvghb")
  }
  scrollBarNaviagtion(text) {
    if (text === 'LEADERBOARD') {
      this.props.navigation.navigate("LeaderBoard")
    }
    if (text === 'WALLET') {
      this.props.navigation.navigate("Wallet")
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
                  <Logo width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                  <Text style={{ color: 'white' }}>1000</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Image style={styles.ProfilePicture} resizeMode="contain" source={JCImages.placeholderImage} />
              </TouchableOpacity>
              <View style={styles.SecondDiamond}>
                <View style={styles.mainRightLayout}>
                  <Logo width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                  <Text style={{ color: 'white' }}>1000</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Text style={{ color: 'white' }}>Niteesh Kumar</Text>
          </View>
          <View style={{ paddingBottom: 20, alignItems: 'center' }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                scrollBarData.map((object) => (
                  <View style={styles.scrollBar}>
                    <TouchableOpacity style={styles.scrollBarItem} onPress={() => this.scrollBarNaviagtion(object.text)}>
                      <Image style={styles.itemImage} source={object.image} />
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

          <FlatList
            data={this.props.achievements}
            renderItem={({ item, index }) =>
              <View>
                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ width: '75%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ padding: 5 }}>
                      <Text style={{ color: 'white' }}>{item.text}</Text>
                    </View>
                    <View style={{ width: '100%', height: 5, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 3, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                      <View style={{ width: "" + 644 / 10 + "%", height: '100%' }}>
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
                      this.props.game.score.level == this.props.userachievements[index].level ?
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
          />

          <StatusBar barStyle="light-content" hidden={false} translucent={true} />
        </ScrollView>
      </SafeAreaView >
    );
  }
}


function mapStateToProps(state) {
  console.log(state.achievements)
  return {
    userachievements: state.userachievements.userachivements,
    achievements: state.achievements.achievements,
    game: state.game
  };
}


function mapDispatchToProps(dispatch) {
  return {

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
