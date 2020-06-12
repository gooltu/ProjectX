import React from 'react'
import {
  Image,
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import styles from './GiftTaskDetail.styles'
import Coin from '../../../../svg_components/Coin';
import Logo from '../../../../svg_components/Logo';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../../shared_styles/colors'
import XP from '../../../../svg_components/XP';
import { FlatList } from 'react-native-gesture-handler';
import JCImages from '../../../../../assets/JCImages'
import { renderJewel } from '../../../../JCUtils/CommonUtils';
import Icon from 'react-native-vector-icons/FontAwesome'
import NetworkManager from '../../../../../network/NetworkManager';
import rest from '../../../../../network/rest';
import actions from '../../../../../actions';


class TaskDetail extends React.Component {

  constructor(props) {
    super(props)
    this.giftTask = this.props.navigation.state.params.giftTask
    console.log(this.giftTask)
    this.count = 0
  }
  jewelView(jewel) {
    let jewelView = []
    for (let i = 0; i < jewel.count; i++) {
      jewelView.push(
        renderJewel(jewel.jeweltype_id, 30, 30, styles.jewelStyle)
      )
    }
    return jewelView
  }

  componentDidMount() {
    let data = {
      'gifttask_id': this.giftTask.id
    }
    NetworkManager.callAPI(rest.getGiftTasksElements, 'POST', data).then(result => {
      console.log(result)
      let data = JSON.parse(JSON.stringify(this.props.gifttaskdetails))
      data[this.giftTask.id] = result.gifttaskdetails
      this.props.setGiftTaskDetails(data)
    }).catch(error => {

    })
    NetworkManager.callAPI(rest.getGiftTaskLevel, 'POST', data).then(result => {
      let data = JSON.parse(JSON.stringify(this.props.usergifttasks))
      data[this.giftTask.id] = result.gifttaskusers[0]
      this.props.setUserGiftTask(data)
    }).catch(error => {

    })
  }

  CheckAvailablity(RequiredJewel) {
    let jewel = this.props.game.jewels.filter((jewelType) => {
      return (RequiredJewel.jeweltype_id === jewelType.jeweltype_id)
    })
    console.log(RequiredJewel.count, jewel)
    if (jewel[0].count < RequiredJewel.count) {
      return true
    }
    else {
      this.count++
      console.log('Count', this.count)
      return false
    }
  }
  checkEligibility() {
    if (this.props.gifttaskdetails[this.giftTask.id].length === this.count)
      return true
    else
      return false
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          {this.giftTask.cash === 0 ?
            <Image
              style={{ width: 160, height: 200, borderRadius: 7 }}
              source={{ uri: this.giftTask.product_pic }}
            /> :
            <View style={{ backgroundColor: color.jcgray, width: 160, height: 200, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: color.darkcolor1, fontSize: 30, fontWeight: 'bold' }}>{'\u20B9'} {this.giftTask.money}</Text>
            </View>
          }
        </View>

        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
        {this.props.usergifttasks.hasOwnProperty(this.giftTask.id) ?
          <View style={{ padding: 10 }}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', paddingBottom: 8 }}>{this.giftTask.productname}</Text>
            <Text style={{ color: color.jcgray, fontSize: 11, paddingBottom: 8 }}>{this.giftTask.productdetail}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: color.jcgray, fontSize: 11 }}>{this.giftTask.current_qty}/{this.giftTask.total_qty}</Text>
              <Text style={{ color: color.jcgray, fontSize: 11 }}>EXPIRATION DATE: {(this.props.usergifttasks[this.giftTask.id].expiration_at).split('T')[0]}</Text>
            </View>
          </View> : null}

        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
        <View>
          <Text style={styles.CollectText}>COLLECT JEWELS</Text>
        </View>
        {this.props.gifttaskdetails.hasOwnProperty(this.giftTask.id) ?
          <View style={{ paddingBottom: 20, flexDirection: 'column' }}>
            {
              this.props.gifttaskdetails[this.giftTask.id].map((jewel) =>

                <View style={{ flexDirection: 'row', padding: 5 }}>

                  <View style={{ flexDirection: 'row', width: '85%', paddingLeft: '20%', justifyContent: 'center', alignItems: 'center' }}>
                    {this.jewelView(jewel)}
                  </View>
                  <View style={{ width: '15%' }}>
                    {
                      this.CheckAvailablity(jewel) ? <Icon name='close' color='red' size={20} /> : <Icon name='check' color='green' size={20} />
                    }
                  </View>
                </View>
              )
            }

          </View> : null}
        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>

        {this.props.gifttaskdetails.hasOwnProperty(this.giftTask.id) && this.props.usergifttasks.hasOwnProperty(this.giftTask.id)?
          this.props.game.scores.level < this.props.usergifttasks[this.giftTask.id].level ?
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
              <View style={{ justifyContent: 'center', width: 150, alignItems: 'center', backgroundColor: color.darkcolor2, borderRadius: 5, borderWidth: 1, borderColor: color.jcgray, paddingHorizontal: 25, paddingVertical: 10 }}>
                <Text style={{ color: color.jcgray }}>LEVEL {this.props.usergifttasks[this.giftTask.id].level}</Text>
              </View>
            </View>
            :
            this.checkEligibility() ?
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <View style={{ width: 220, height: 45, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                  <View style={{ width: "100%", height: '100%' }}>
                    <ImageBackground source={JCImages.colorGrad} style={{
                      width: '100%', height: '100%', justifyContent: 'center',
                      alignItems: 'center', overflow: 'hidden'
                    }}></ImageBackground>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('SuccessFullGiftRedeem')}
                  style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>WIN GIFT</Text>
                </TouchableOpacity>
              </TouchableOpacity> :
              <View style={{ alignItems: 'center', paddingTop: 10 }}>
                <View style={{ justifyContent: 'center', width: 150, alignItems: 'center', backgroundColor: color.darkcolor2, borderRadius: 5, borderWidth: 1, borderColor: color.jcgray, paddingHorizontal: 25, paddingVertical: 10 }}>
                  <Text style={{ color: color.jcgray }}>WIN GIFT</Text>
                </View>
              </View> : null

        }

        <View>

        </View>


      </SafeAreaView>
    );
  }

}

function mapStateToProps(state) {
  return {
    tasks: state.tasks.tasks,
    taskdetails: state.taskdetails.taskdetails,
    gifttasks: state.gifttasks.gifttasks,
    gifttaskdetails: state.gifttaskdetails.taskdetails,
    usergifttasks: state.usergifttasks.usergifttasks,
    game: state.game
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setGiftTaskDetails: (payload) => dispatch(actions.setGiftTaskDetails(payload)),
    setUserGiftTask: (payload) => dispatch(actions.setUserGiftTask(payload))

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);