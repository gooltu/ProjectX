import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Text
} from "react-native";
import { connect } from 'react-redux';
import { FAB, Portal, Provider } from 'react-native-paper';
import styles from './ChatList.styles'
import Logo from '../../../../svg_components/Logo';
import Coin from '../../../../svg_components/Coin';
import Diamond from '../../../../svg_components/Diamond';
import J3 from '../../../../svg_components/J3';
import J6 from '../../../../svg_components/J12';
import TabIcon from "../../../../svg_components/TabIcons";
import colors from "../../../../shared_styles/colors";
import db from '../../../../../db/localdatabase'
import actions from '../../../../../actions'
import { setActiveChat } from '../../../../../actions/chatListActions'

function Item({ item, onpressitem, onlongpressitem }) {

  return (
    <TouchableOpacity
      onPress={() => onpressitem(item)}
      onLongPress={() => onlongpressitem(item._ID)}
      style={styles.mainConatiner}
    >
      <View style={styles.subContainer}>
        <View style={styles.marginstyle} />
        <View style={styles.chatBox}>
          {item.SMALL_IMAGE && item.JEWELCHAT_ID != 1 &&
            <ImageBackground
              source={{ uri: item.SMALL_IMAGE }}
              style={styles.imgBackground}></ImageBackground>
          }
          {
            item.JEWELCHAT_ID == 1 && <Logo height="75%" width="75%" style={styles.jewelStyle} />
          }
          {
            !item.SMALL_IMAGE && item.JEWELCHAT_ID != 1 && <J6 height="75%" width="75%" style={styles.jewelStyle} />
          }
        </View>
        <View style={styles.chatboxLeftContainer} >
          <Text style={styles.name}>{item.PHONEBOOK_CONTACT_NAME ? item.PHONEBOOK_CONTACT_NAME : (item.JEWELCHAT_ID == 1 ? 'Team JewelChat' : '+' + item.CONTACT_NUMBER)}</Text>
          <Text style={styles.msgText}>{item.MSG_TEXT != null ? item.MSG_TEXT.substring(0, 25) + (item.MSG_TEXT.length > 25 ? '...' : '') : ''}</Text>
        </View>
      </View>
      <View style={styles.itemLeftConatiner} >
        <View style={styles.itemLeftSubContainer}>
          <Text style={styles.msgCreateTime}>{relativeDateSting(item.LAST_MSG_CREATED_TIME)}</Text>
          {item.UNREAD_COUNT > 0 &&
            <View style={styles.unreadCount}>
              <Text
                style={styles.countText} >
                {item.UNREAD_COUNT}
              </Text>
            </View>
          }
        </View>
        <View style={styles.marginStyleLeft} />
      </View>
    </TouchableOpacity>
  );
}


class ChatList extends React.Component {


  state = {
    open: false
  }


  componentDidMount() {
    //console.log(this.props.navigation.state.routes[this.props.navigation.state.index]);
    //console.log(this.props);
    //console.log(this.props.navigation.state.routeName);
    console.log('ChatList Mount');
  }

  componentWillUnmount() {
    console.log('ChatList UnMount');
  }

  render() {
    return (
      <View style={styles.rootContainer}>

        <Provider>
          <Portal>
            <FlatList
              data={this.props.chatslist}
              extraData={this.props}
              renderItem={({ item }) => (
                <Item item={item}
                  onpressitem={(item) => {
                    this.props.setActiveChat(item)
                    db.getChats(item.JID, 0)
                      .then(results => {
                        console.log('FROM JEWELCHAT COMPONENT GETCHAT SUCCESS')
                        console.log(results.rows.length)
                        let chatroom = []
                        for (let i = 0; i <results.rows.length; i++) {
                          chatroom.push(results.rows.item(i))
                        }
                        this.props.setChatData(chatroom)

                      })
                      .catch(err => {
                        console.log('FROM JEWELCHAT COMPONENT GETCHAT ERROR')
                        console.log(err)
                      })
                    this.props.navigation.navigate('ChatPage', item)
                  }}
                  onlongpressitem={(id) => { this.props.navigation.navigate('MyModal', { modal_name: 'chatlist_longpress', item }) }}
                />
              )}
              keyExtractor={item => item._ID + ''}
            />

            <FAB.Group
              style={{ paddingBottom: 30 }}
              fabStyle={{ backgroundColor: colors.lightcolor2 }}
              color={'white'}
              open={this.state.open}
              icon={this.state.open ? 'today' : 'add'}
              actions={[
                { icon: 'email', label: 'New Group', color: 'white', style: { backgroundColor: colors.lightcolor2 }, onPress: () => console.log('Pressed email') },
                { icon: 'phone', label: 'Contacts', color: 'white', style: { backgroundColor: colors.lightcolor2 }, onPress: () => this.props.navigation.navigate('Contacts') },
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
            />

          </Portal>
        </Provider>



      </View>
    );
  }
}




function relativeDateSting(last_msg_time) {

  let date = new Date(Number(last_msg_time));

  let delta = Math.round((+new Date - date) / 1000);

  let minute = 60,
    hour = minute * 60,
    day = hour * 24;

  let fuzzy;

  if (delta < 30) {
    fuzzy = 'just now';
  } else if (delta < minute) {
    fuzzy = delta + ' seconds ago';
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago'
  } else if (delta < hour) {
    fuzzy = Math.floor(delta / minute) + ' minutes ago';
  } else if (Math.floor(delta / hour) == 1) {
    fuzzy = '1 hour ago.'
  } else if (delta < day) {
    fuzzy = Math.floor(delta / hour) + ' hours ago.';
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  } else {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    fuzzy = dd + '/' + mm + '/' + yyyy;
  }

  return fuzzy;

}

function mapStateToProps(state) {
  return {
    chatslist: state.chatslist.chatList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setActiveChat: (activeChat) => dispatch(setActiveChat(activeChat)),
    setChatData: (chatData) => dispatch(actions.setChatData(chatData))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
