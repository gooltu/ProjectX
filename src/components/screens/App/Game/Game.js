import React from 'react'
import {
  Image,
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  SectionList,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import styles from './Game.styles'
import Coin from '../../../svg_components/Coin';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../shared_styles/colors'
import XP from '../../../svg_components/XP';
import { FlatList } from 'react-native-gesture-handler';
import NetworkManager from '../../../../network/NetworkManager';
import rest from '../../../../network/rest';
import actions from '../../../../actions';
import { InterstitialAd, RewardedAd, RewardedAdEventType, BannerAdSize, BannerAd, TestIds } from '@react-native-firebase/admob';

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      reachedEnd: false,
      page: 0
    }
  }
  componentDidMount() {
    console.log(this.props.gifttasks)
    this.getTaskDetails()
    this.getGiftTask(this.state.page)
  }

  getTaskDetails() {
    if (this.props.tasks.length == 0) {
      NetworkManager.callAPI(rest.getTasks, 'POST', null).then(result => {
        console.log(result)
        this.props.setTaskData(result.tasks)
      }).catch(error => {
      })
    }
  }
  getGiftTask(page) {
    console.log('page',page)
    NetworkManager.callAPI(rest.getGiftTasks, 'POST', { page: page }).then(result => {
      console.log(result.gifttasks)
      if (result.gifttasks.length > 0) {
        this.setState({
          reachedEnd: false,
          page: page + 1
        })
        let data = page == 0 ? [] : JSON.parse(JSON.stringify(this.props.gifttasks))
        let dataToInsert = { title: 'section' + page, data: [result.gifttasks] }
        data.push(dataToInsert)
        console.log(dataToInsert)
        this.props.setGiftTaskData(data)
      }
      else
        this.setState({
          reachedEnd: true,
          page: 0
        })
    }).catch(error => {

    })
  }

  _renderList = (data) => {
    console.log('itemm', data)
    return (
      <FlatList numColumns={2}
        style={{ padding: 10 }}
        data={data}
        renderItem={({ item, index }) =>
          item.cash === 0 ?
            <TouchableOpacity style={{ width: '48%', borderRadius: 10, padding: 5, margin: 5, backgroundColor: color.darkcolor3 }}
              onPress={() => {
                console.log(item)
                this.props.navigation.navigate('GiftTaskDetail', { giftTask: item })
              }}
            >
              <Image
                style={{ width: '100%', height: 180, borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
                source={{ uri: item.product_pic }}
              />
              <View style={{ paddingVertical: 5 }}>
                <Text numberOfLines={1} style={{ color: 'white', fontWeight: '600', fontSize: 13, paddingBottom: 3 }}>{item.productname}</Text>
                <Text style={{ color: color.jcgray, fontSize: 11 }}>QTY: {item.current_qty}/{item.total_qty}</Text>
              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ width: '48%', borderRadius: 10, padding: 5, margin: 5, backgroundColor: color.darkcolor3 }}
              onPress={() => this.props.navigation.navigate('GiftTaskDetail', { giftTask: item })}
            >
              <View style={{ backgroundColor: color.jcgray, width: '100%', height: 180, borderTopRightRadius: 7, borderTopLeftRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: color.darkcolor1, fontSize: 30, fontWeight: 'bold' }}>{'\u20B9'} {item.money}</Text>
              </View>
              <View style={{ paddingVertical: 5 }}>
                <Text numberOfLines={1} style={{ color: 'white', fontWeight: '600', fontSize: 13, paddingBottom: 3 }}>{item.productname}</Text>
                <Text style={{ color: color.jcgray, fontSize: 11 }}>QTY: {item.current_qty}/{item.total_qty}</Text>
              </View>
            </TouchableOpacity>
        }
        keyExtractor={item => item.id + ''}
      />
    )
  }
  _renderSectionHeader = ({ section, sectionIndex }) => {
    return (
      // <BannerAd
      //   unitId={TestIds.BANNER}
      //   size={BannerAdSize.SMART_BANNER}
      //   requestOptions={{
      //     requestNonPersonalizedAdsOnly: true,
      //   }} />
      <View>
        <Text>header replace by ads</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView>
        <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
          <Text style={{ color: color.jcgray, fontSize: 11, }}>WIN GAME POINTS AND GAME COINS</Text>
        </View>
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
            {
              this.props.tasks.map((task) => (
                <View style={styles.scrollBar}>
                  <TouchableOpacity style={styles.scrollBarItem} onPress={() => {
                    this.props.navigation.navigate("TaskDetail", { task: task })
                  }}>
                    <View style={styles.itemOne}>
                      <Coin height="30" width="30" />
                      <Text style={styles.itemText}>{task.coins}</Text>
                    </View>
                    <View style={styles.itemOne}>
                      <XP height="30" width="30" />
                      <Text style={styles.itemText}>{task.points}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
        {this.props.gifttasks.length > 0 ?
          <SectionList
            renderItem={({ item }) => (this._renderList(item))}
            renderSectionHeader={this._renderSectionHeader}
            sections={this.props.gifttasks}
            keyExtractor={(item, index) => item + index}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (this.state.reachedEnd == false)
                this.getGiftTask(this.state.page)
            }
            }
          /> : null}
          </ScrollView>
        <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      </SafeAreaView>
    );
  }

}

function mapStateToProps(state) {
  return {
    tasks: state.tasks.tasks,
    taskdetails: state.taskdetails,
    gifttasks: state.gifttasks.gifttasks,
    gifttaskdetails: state.gifttaskdetails,
    usergifttasks: state.usergifttasks
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setTaskData: (payload) => dispatch(actions.setTaskData(payload)),
    setGiftTaskData: (payload) => dispatch(actions.setGiftTaskData(payload))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);