import React from 'react'
import {
  StatusBar,
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native';
import styles from './Game.styles'
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../shared_styles/colors'
import NetworkManager from '../../../../network/NetworkManager';
import rest from '../../../../network/rest';
import actions from '../../../../actions';
import GiftTaskView from './GiftTaskView'
import { InterstitialAd, RewardedAd, RewardedAdEventType, BannerAdSize, BannerAd, TestIds } from '@react-native-firebase/admob';
import TaskView from './TaskView';

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
    // if (this.props.tasks.length == 0) {
    NetworkManager.callAPI(rest.getTasks, 'POST', null).then(result => {
      console.log(result)
      this.props.setTaskData(result.tasks)
    }).catch(error => {
    })
    // }
  }
  getGiftTask(page) {
    console.log('page', page)
    NetworkManager.callAPI(rest.getGiftTasks, 'POST', { page: page }).then(result => {
      console.log(result.gifttasks)
      if (result.gifttasks.length > 0) {
        this.setState({
          reachedEnd: false
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
        onEndReached={() => {
          console.log('test end reached')
          if (this.state.reachedEnd == false) {
            this.getGiftTask(this.state.page + 1)
          }
          this.setState({
            page: this.state.page + 1
          })
        }
        }
        ListFooterComponent={this._renderSectionFooter}
        renderItem={({ item, index }) =>
          <GiftTaskView navigation={this.props.navigation} giftTask={item} />
        }
        keyExtractor={item => item.id + ''}
      />
    )
  }
  _renderSectionHeader = () => {
    return (
      //  item.title == 'section0' ? 
      <View>
        <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
          <Text style={{ color: color.jcgray, fontSize: 11, }}>WIN GAME POINTS AND GAME COINS</Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
          {
            this.props.tasks.map((task) => (
              <TaskView navigation={this.props.navigation} task={task} />
            ))
          }
        </ScrollView>
      </View>
      //: null
    )
  }
  _renderSectionFooter = () => {
    return (
      // <BannerAd
      //   unitId={TestIds.BANNER}
      //   size={BannerAdSize.SMART_BANNER}
      //   requestOptions={{
      //     requestNonPersonalizedAdsOnly: true,
      //   }} />
      <View>
        <Text>footer replace by ads</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>

        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
        {this.props.gifttasks.length > 0 ?
          <FlatList
            bounces={false}
            data={this.props.gifttasks}
            renderItem={({ item, index }) =>
              this._renderList(item.data[0])
            }
            onEndReachedThreshold={0.5}
            ListHeaderComponent={this._renderSectionHeader}

            keyExtractor={(item, index) => item + index}
          />
          : null}
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