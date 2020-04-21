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
  TouchableOpacity
} from 'react-native';
import styles from './Game.styles'
import Coin from '../../../svg_components/Coin';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../shared_styles/colors'
import XP from '../../../svg_components/XP';
import { FlatList } from 'react-native-gesture-handler';



class Game extends React.Component {

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
          <Text style={{ color: color.jcgray, fontSize: 11, }}>WIN GAME POINTS AND GAME COINS</Text>
        </View>
        <View >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
            {
              this.props.tasks.map((task) => (
                <View style={styles.scrollBar}>
                  <TouchableOpacity style={styles.scrollBarItem} onPress={() => {
                    this.props.navigation.navigate("TaskDetail", { task: task })
                  }}>
                    <View style={styles.itemOne}>
                      <Coin height="25" width="25" />
                      <Text style={styles.itemText}>{task.coins}</Text>
                    </View>
                    <View style={styles.itemOne}>
                      <XP height="25" width="25" />
                      <Text style={styles.itemText}>{task.points}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </View>

        <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>

        <FlatList
          data={this.props.gifttasks}
          numColumns={2}
          style={{ padding: 10 }}
          renderItem={({ item, index }) =>
            item.cash === 0 ?
              <TouchableOpacity style={{ width: '48%', borderRadius: 10, padding: 5, margin: 5, backgroundColor: color.darkcolor3 }}
                onPress={() =>{
                  console.log(item)
                  this.props.navigation.navigate('GiftTaskDetail', { giftTask: item })
                } }
              >
                <Image
                  style={{ width: '100%', height: 180, borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
                  source={{ uri: item.product_pic }}
                />
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 13, paddingBottom: 3 }}>{item.productname}</Text>
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
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 13, paddingBottom: 3 }}>{item.productname}</Text>
                  <Text style={{ color: color.jcgray, fontSize: 11 }}>QTY: {item.current_qty}/{item.total_qty}</Text>
                </View>
              </TouchableOpacity>
          }
          keyExtractor={item => item.id}
        />

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

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);