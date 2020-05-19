import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Text
} from "react-native";
import J6 from '../../../svg_components/J6';
import styles from './Contacts.styles'
import { connect } from 'react-redux';
import colors from "../../../shared_styles/colors";
import Logo from '../../../svg_components/Logo';
import { Searchbar } from 'react-native-paper'
import NetworkManager from "../../../../network/NetworkManager";
import rest from "../../../../network/rest";
import db from "../../../../db/localdatabase";
import actions from '../../../../actions/index'
import { getContacts } from '../../../JCUtils/CommonUtils'


class Contacts extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
      contactData: []
    }
  }
  componentDidMount() {
    getContacts(this.getContactsCallback)
  }
  getContactsCallback = () => {
    console.log('came to callback')
    db.getContactList().then(results => {
      let chatList = []
      for (let i = 0; i < results.rows.length; i++) {
        chatList.push(results.rows.item(i))
      }
      this.setState({
        contactData: chatList
      })
    }).catch(err => {
      console.log(err)
    })
  }

  _onChangeSearch = (query) => {
    this.setState({ searchQuery: query })
  }
  render() {
    return (
      <View style={styles.rootContainer}>
        <Searchbar
          placeholder="Search Contacts"
          onChangeText={this._onChangeSearch}
          value={this.state.searchQuery}
          style={{ backgroundColor: colors.darkcolor3, color: 'white' }}
          inputStyle={{ color: 'white', fontSize: 14 }}
          placeholderTextColor='white'
          iconColor='white'
          theme='dark'
        />
        <FlatList
          data={this.state.contactData}
          renderItem={({ item }) => (
            <Item item={item}
              onpressitem={(item) => {
                inviteUser(item, this.props)
              }}
            />
          )}
          keyExtractor={item => item._ID + ''}
        />
        <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      </View>
    );
  }
}

function Item({ item, onpressitem }) {


  return (
    <TouchableOpacity
      onPress={() => onpressitem(item)}
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
          <Text style={styles.msgText}>{item.STATUS_MSG != null ? item.STATUS_MSG.substring(0, 25) + (item.STATUS_MSG.length > 25 ? '...' : '') : ''}</Text>
        </View>
      </View>
      <View style={styles.itemLeftConatiner} >
        <TouchableOpacity style={styles.itemLeftSubContainer}
          disabled={item.IS_INVITED==1?true:false}
          onPress={() =>  onpressitem(item)}
        >
          <Text style={styles.inviteText}>{item.IS_REGIS == 0 ? 'INVITE' : ''}</Text>
        </TouchableOpacity>
        <View style={styles.marginStyleLeft} />
      </View>
    </TouchableOpacity>
  );
}

function inviteUser(item, props) {
  console.log(item)
  let data = {
    phone: item.CONTACT_NUMBER
    //  phone: '918756463536'
  }
  NetworkManager.callAPI(rest.inviteUser, 'post', data).then(result => {
    console.log(result)
    if (result.is_regis) {
      result.contact['invited'] = 1
      result.contact['regis'] = 1
      db.updateContact(result.contact).then(result => {
        db.getChatList().then(results => {
          let chatList = []
          for (let i = 0; i < results.rows.length; i++) {
            chatList.push(results.rows.item(i))
          }
          props.setChatListData(chatList)
        })
          .catch(err => {
            console.log(err)
          })
      })

      db.getChats(item.JID, 0)
        .then(results => {
          let chatroom = []
          for (let i = 0; i < results.rows.length; i++) {
            chatroom.push(results.rows.item(i))
          }
          props.setChatData(chatroom)
        })
        .catch(err => {
          console.log(err)
        })
      props.setActiveChat(item)
      props.navigation.navigate('ChatPage', item)
    }
  }).catch(error => {
    console.log(error)
  })
}
function mapStateToProps(state) {
  return {
    chatslist: state.chatslist.chatList
  }
}


function mapDispatchToProps(dispatch) {
  return {
    setActiveChat: (activeChat) => dispatch(actions.setActiveChat(activeChat)),
    setChatListData: (chatList) => dispatch(actions.setChatListData(chatList)),
    setChatData: (chatdata) => dispatch(actions.setChatData(chatdata))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Contacts);