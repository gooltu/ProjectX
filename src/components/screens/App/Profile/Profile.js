import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  CameraRoll
} from "react-native";

import CustomHeader from "../../../shared_components/CustomHeader";
import styles from './Profile.styles'
import strings from './Profiles.strings'
import color from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import { ScrollView } from "react-native-gesture-handler";

const scrollBarData = [
  {
    'image': JCImages.wallet,
    'text' : 'WALLET'
  },
  {
    'image': JCImages.trophy,
    'text' : 'LEADERBOARD'
  },
  {
    'image': JCImages.setting,
    'text' : 'SETTINGS'
  },
  {
    'image': JCImages.share,
    'text' : 'SHARE'
  }
]
export default class Profile extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/
scrollBarNaviagtion(text){
  if(text==='LEADERBOARD'){
    this.props.navigation.navigate("LeaderBoard")
  }
  if(text==='WALLET'){
    this.props.navigation.navigate("Wallet")
  }
}
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{paddingTop: 40}}>
        <View style={styles.profileSection}>
          <View style={styles.firstDiamond}>
              <View style={styles.mainLeftLayout}>
                <Image style={styles.DiamondImage} source={JCImages.diamond}/>
                <Text style={{color:'white'}}>1000</Text>
              </View>
          </View>
          <TouchableOpacity>
              <Image style={styles.ProfilePicture} resizeMode="contain" source={JCImages.placeholderImage}/>
          </TouchableOpacity>
          <View style={styles.SecondDiamond}>
          <View style={styles.mainRightLayout}>
                <Image style={styles.DiamondImage} source={JCImages.diamond}/>
                <Text style={{color:'white'}}>1000</Text>
              </View>
          </View>
        </View>
        </View>
        <View style={{alignItems:'center',paddingTop:20}}>
          <Text style={{color:'white'}}>Niteesh Kumar</Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {
            scrollBarData.map((object)=> (
              <View style={styles.scrollBar}>
                <TouchableOpacity style={styles.scrollBarItem} onPress={()=>this.scrollBarNaviagtion(object.text)}>
                  <Image style={styles.itemImage} source={object.image}/>
                  <Text style={styles.itemText}>{object.text}</Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>
        <StatusBar barStyle="light-content" hidden={false} translucent={true} /> 
      </SafeAreaView>
    );
  }
}
