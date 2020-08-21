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
import LeaderBoardRow from "./LeaderBoardRow";

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
    this.user
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
          'phone': this.props.mytoken.myphone
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
            <LeaderBoardRow type={'other'} item={item} />
          )}
          {Object.keys(this.props.game).length > 0 ?
            <LeaderBoardRow type={'user'}  item={
              {
                pic: this.state.imagepath,
                name: 'You',
                level: this.props.game.scores.level,
                diamond: this.props.game.jewels[0].total_count,
                coins: this.props.game.jewels[1].total_count
              }
            } />
            : null}
          {this.props.leaderboard.top2.map(item =>
            <LeaderBoardRow type={'other'} item={item} />
          )}
        </ScrollView>
      </SafeAreaView >
    );
  }
}

function mapStateToProps(state) {
  return {
    leaderboard: state.leaderboard.leaderboard,
    game: state.game,
    mytoken: state.mytoken
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setLeaderBoard: (payload) => dispatch(actions.setLeaderBoard(payload))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
