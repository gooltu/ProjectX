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
import CustomLoader from '../../../shared_components/CustomLoader';

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      reachedEnd: false,
      page: 0,
      isLoading: false,
      giftTaskLoading: false
    }
  }
  componentDidMount() {
    //console.log(this.props.gifttasks)
    this.getTaskDetails()
    this.getGiftTask()
  }

  getTaskDetails() {
      console.log('GET TASKS')
      if (this.props.tasks.length == 0) {

          this.setState({ isLoading: true });
          NetworkManager.callAPI(rest.getTasks, 'POST', null).then(result => {
            console.log('Tasks')
            console.log(result.tasks)
            this.setState({
              isLoading: false
            })
            this.props.setTaskData(result.tasks)
          }).catch(error => {
          })

      }
  }

  getGiftTask() {
    this.setState({
      giftTaskLoading: true
    })
    NetworkManager.callAPI(rest.getGiftTasks, 'POST', { page: this.state.page }).then(result => {
      if (result.gifttasks.length > 0) {
        let data = (this.state.page == 0 ? [] : JSON.parse(JSON.stringify(this.props.gifttasks)))
        let dataToInsert = { title: 'section' + this.state.page, data: [result.gifttasks] }
        data.push(dataToInsert)
        console.log(dataToInsert)
        this.props.setGiftTaskData(data)
      }
      this.setState({
        giftTaskLoading: false
      })
    }).catch(error => {

    })
  }

  LoadMoreRandomData = () => {
    if (!this.state.giftTaskLoading) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.getGiftTask()
      })
    }
  }
  _renderList = (data) => {
    console.log('itemm', data)
    return (
      <FlatList numColumns={2}
        style={{ padding: 10 }}
        data={data}
        onEndReached={this.LoadMoreRandomData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this._renderSectionFooter}
        renderItem={({ item, index }) =>
          <GiftTaskView navigation={this.props.navigation} giftTask={item} />
        }
        keyExtractor={item => item.id + ''}
      />
    )
  }

  _renderSectionHeader = () => {
    console.log('HEADER')
    return (
      //  item.title == 'section0' ? 
      <View>
        <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
          <Text style={{ color: color.jcgray, fontSize: 11, }}>WIN GAME POINTS AND GAME COINS</Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
          {
            this.props.tasks.map((task, key ) => (
              <TaskView navigation={this.props.navigation} task={task} key={task.task_id}/>
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
        <CustomLoader loading={this.state.isLoading} />
        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
        {this.props.gifttasks.length > 0 ?
          <FlatList
            bounces={false}
            data={this.props.gifttasks}
            renderItem={({ item, index }) =>
              this._renderList(item.data[0])
            }
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