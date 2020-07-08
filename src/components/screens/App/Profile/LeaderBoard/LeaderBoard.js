import React from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  CameraRoll
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import CustomHeader from "../../../../shared_components/customHeader/CustomHeader";
import JCImages from '../../../../../assets/JCImages'
import styles from './LeaderBoard.styles'
import NetworkManager from "../../../../../network/NetworkManager";
import rest from "../../../../../network/rest";
import actions from "../../../../../actions";
import { connect } from 'react-redux';
import colors from "../../../../shared_styles/colors";
import { renderJewel } from '../../../../JCUtils/CommonUtils'

class LeaderBoard extends React.Component {
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
      userProfile: {}
    }
  }

  componentDidMount() {
    console.log(this.props.leaderboard)
    this.loadProfilePicture()
    NetworkManager.callAPI(rest.getLeaderBoard, 'GET', null).then(result => {
      let top1 = result.top1.concat(result.top2)
      let top2 = result.top3.concat(result.top4)
      //this.props.setLeaderBoard({ top1: top1, top2: top2 })
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
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>

        <ScrollView style={{ padding: 10 }}>
          {this.props.leaderboard.top1.map(item =>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'grey', borderRadius: 10, borderWidth: 1, padding: 5, marginBottom: 10 }}>
              <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={item.pic != '' ? { uri: item.pic } : JCImages.placeholderImage}></Image>
              <View style={{ flexDirection: 'column', paddingLeft: 10, width: '70%' }}>
                <Text style={{ color: 'lightgrey', fontSize: 16, paddingBottom: 5 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>LEVEL:</Text>
                    <Text style={{ color: 'white' }}> {item.level}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(0, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {item.diamond}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(1, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {item.coins}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {Object.keys(this.props.game).length > 0 ?
            <View style={{ backgroundColor: colors.lightBlue, flexDirection: 'row', alignItems: 'center', borderColor: colors.lightBlue, borderRadius: 10, borderWidth: 1, padding: 5, marginBottom: 10 }}>
              <Image style={{ width: 60, height: 60, borderRadius: 30 }} key={this.state.imagepath} source={this.state.imagepath != '' ? { uri: this.state.imagepath } : JCImages.placeholderImage}></Image>
              <View style={{ flexDirection: 'column', paddingLeft: 10, width: '70%' }}>
                <Text style={{ color: 'lightgrey', fontSize: 16, paddingBottom: 5 }}>You</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>LEVEL:</Text>
                    <Text style={{ color: 'white' }}> {this.props.game.scores.level}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(0, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {this.props.game.jewels[0].total_count}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(1, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {this.props.game.jewels[1].total_count}</Text>
                  </View>
                </View>
              </View>
            </View> : null}
          {this.props.leaderboard.top2.map(item =>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'grey', borderRadius: 10, borderWidth: 1, padding: 5, marginBottom: 10 }}>
              <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={item.pic != '' ? { uri: item.pic } : JCImages.placeholderImage}></Image>
              <View style={{ flexDirection: 'column', paddingLeft: 10, width: '70%' }}>
                <Text style={{ color: 'lightgrey', fontSize: 16, paddingBottom: 5 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>LEVEL:</Text>
                    <Text style={{ color: 'white' }}> {item.level}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(0, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {item.diamond}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderJewel(1, 25, 25, styles.jewelStyle)}
                    <Text style={{ color: 'white' }}> {item.coins}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView >
    );
  }
}

function mapStateToProps(state) {
  return {
    leaderboard: state.leaderboard.leaderboard,
    game: state.game
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setLeaderBoard: (payload) => dispatch(actions.setLeaderBoard(payload))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
