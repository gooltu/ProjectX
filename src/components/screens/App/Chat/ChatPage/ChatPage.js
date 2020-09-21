
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  InputAccessoryView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Animated,
  Alert,
  PanResponder,
  TouchableOpacity
} from 'react-native';

import styles from './ChatPage.styles'
import colors from "../../../../shared_styles/colors";
import J6 from '../../../../svg_components/J6';
import J3 from '../../../../svg_components/J6';
import { connect } from 'react-redux';
import { CheckBox, Item } from 'native-base'
import { sendReply, sendReadReceipt, sendSubscriptionRequest } from '../../../../../network/realtime'
import actions from '../../../../../actions'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/MaterialIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import db from '../../../../../db/localdatabase'
import rest from '../../../../../network/rest';
import axios from 'axios'
import NetworkManager from '../../../../../network/NetworkManager'
import { getContacts, renderJewel } from '../../../../JCUtils/CommonUtils'
import { Snackbar } from 'react-native-paper';

import MainChatBar from './MainChatBar';
import ChatItem from './ChatItem';
import { updateChatPageRedux, updateChatlistRedux } from '../../../../../network/realtime-utils/messages';

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('ChatPage did mount');
    this.props.setChatData([]);    
    this.props.updateChatPageRedux();
    
    //TO DO
    //Update Contacts or Group details
    //Send Read receipts

    //handle Subscription Request
    
  } 

  state = {    
    visible: false,   
    collectingJewel: false,   
    collectionId: null    
  }


  onMediaPress(item) {
    console.log('Media Press');
    this.props.navigation.navigate('ChatMediaViewer', item);

  }


  onJewelPress(item) {
    if (!this.state.collectingJewel) {
      if (this.jewelCount() >= 25) {
        this.setState({
          visible: true
        })
      }
      else {

          this.setState({ collectingJewel: true, collectionId: item._ID });
          let data = {
            jeweltype: item.JEWEL_TYPE
          };


          db.updatePickedJewel(item._ID, 2)
          .then(result => {
              
              this.props.updateChatPageRedux();
              NetworkManager.callAPI(rest.pickJewel, 'POST', data)
              .then(response => {

                  db.updatePickedJewel(item._ID, 1)
                  .then(result => {
                    this.props.updateChatPageRedux();
                    this.setState({ collectingJewel: false, collectionId: null });
                    this.props.game.jewels[item.JEWEL_TYPE].count = this.props.game.jewels[item.JEWEL_TYPE].count + 1
                    this.props.loadGameState(this.props.game)
                  })
                  .catch(error => {
                    this.setState({ collectingJewel: false, collectionId: null })
                  })

              })
              .catch(error => {

                  db.updatePickedJewel(item._ID, 0)
                  .then(result => {
                    this.props.updateChatPageRedux();
                  })
                  .catch(error => {
                    
                  })
                  this.setState({ collectingJewel: false, collectionId: null })
              })

          })
          .catch(error => {
              this.setState({ collectingJewel: false, collectionId: null })
          });        
             

      }

    }
  }

  onListEndReached() {
    console.log('end');
      db.getChats(this.props.activeChat.JID, this.props.chatroom.length)
      .then(chats => {         
          this.props.setChatData(this.props.chatroom.concat(chats))       
      })      
  }

  jewelCount() {
    let jewelCount = 0
    for (let i = 3; i < this.props.game.jewels.length; i++) {
      jewelCount = jewelCount + this.props.game.jewels[i].count
    }
    return jewelCount
  }

  _onDismissSnackBar = () => this.setState({ visible: false });


  render() {

    console.log(this.props);
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={105}
        style={styles.mainContainer}>

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.subContainer}>
            
            <MainChatBar />
                      
            <FlatList
              //   removeClippedSubviews={true}
              style={styles.chatroom}
              inverted
              onEndReachedThreshold={0.7}
              data={this.props.chatroom}
              renderItem={({ item, index }) => (
                <ChatItem item={item} index={index}                
                  allchats={this.props.chatroom}
                  onjewelpress={() => { this.onJewelPress(item) }}
                  onmediapress={() => { this.onMediaPress(item) }}
                />
              )}
              onEndReached={() => {
                console.log('end reached')
                this.onListEndReached()
              }}
              keyExtractor={item => item._ID + ''}
            />
            <Snackbar
              duration={2000}
              style={{ backgroundColor: colors.darkcolor2, borderColor: colors.lightcolor1 , borderWidth:2, alignItems: 'center' }}
              visible={this.state.visible}
              onDismiss={this._onDismissSnackBar}>
              Jewel Store is FULL.
            </Snackbar>
          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}



function mapStateToProps(state) {
  return {
    chatroom: state.chatroom.chatroom,
    activeChat: state.chatslist.activeChat,
    game: state.game
  }
}


function mapDispatchToProps(dispatch) {
  return {
    sendReply: (message, JID, type = 'normal', parent = null) => dispatch(sendReply(message, JID, type, parent)),
    addChatMessage: (chatData) => dispatch(actions.addChatMessage(chatData)),
    sendReadReceipt: (JID) => dispatch(sendReadReceipt(JID)),
    setChatData: (data) => dispatch(actions.setChatData(data)),
    setChatListData: (chatlistData) => dispatch(actions.setChatListData(chatlistData)),
    sendSubscriptionRequest: (JID) => dispatch(sendSubscriptionRequest(JID)),
    loadGameState: (gamestate) => dispatch(actions.loadGameState(gamestate)),
    updateChatPageRedux: () => dispatch(updateChatPageRedux()),
    updateChatlistRedux: () => dispatch(updateChatlistRedux())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);