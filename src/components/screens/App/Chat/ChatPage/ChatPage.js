
import React from 'react'
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
import JCTextInput from "../../../../../utilities/JCTextInput/JCTextInput";
import styles from './ChatPage.styles'
import colors from "../../../../shared_styles/colors";
import J6 from '../../../../svg_components/J6';
import J3 from '../../../../svg_components/J6';
import { connect } from 'react-redux';
import { CheckBox, Item } from 'native-base'
import { sendReply, sendReadReceipt } from '../../../../../network/realtime'
import actions from '../../../../../actions'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon1 from 'react-native-vector-icons/MaterialIcons'
import db from '../../../../../db/localdatabase'
import rest from '../../../../../network/rest';
import axios from 'axios'
import NetworkManager from '../../../../../network/NetworkManager'
import { getContacts } from '../../../../JCUtils/CommonUtils'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('came to did mount')
    //console.log(this.props.navigation.state.routes[this.props.navigation.state.index]);
    console.log(this.props.navigation.setParams({ otherParam: 'Updated!' }));
    this.props.sendReadReceipt(this.props.activeChat.JID)
    //console.log(this.props);
    this.UpdateContact()
    getContacts(this.getContactCallback)
  }

  getContactCallback = () =>{
    //************** update chatlist redux *******************/
  }
  //to update the contact data (Image, JEWELCHAT_ID etc)
  UpdateContact() {
    var data = {
      'phone': '918756463536',
    }
    NetworkManager.callAPI(rest.downloadContact_Phone, 'post', data).then((responseJson) => {
      console.log('responseJson')
      if(responseJson.error==false){
        responseJson.contact['invited'] = 0
        responseJson.contact['regis'] = 1
        db.updateContact(responseJson.contact)
      }
      console.log(responseJson)
    })
      .catch((error) => {
        console.log(error)
      });
  }

  state = {
    replyTriggered: false,
    longPressMessage: false,
    chatboxtext: '',
    selectedParent: {},
    chatboxempty: true,
    replybarshow: false,
    longpressbarshow: false,
    chatbarstyle: { width: '100%', height: 36, backgroundColor: colors.darkcolor3 },
    chattextboxstyle: { flexGrow: 1, maxWidth: '80%', height: 24, borderColor: colors.lightcolor1, borderWidth: 1, borderRadius: 10, color: 'white', fontSize: 14, backgroundColor: colors.darkcolor3, padding: 5, overflow: 'scroll', textAlignVertical: 'top', marginLeft: 4, marginRight: 4 }
  }

  repliesBar() {
    return (
      this.state.replyTriggered ?
        <View style={{ alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row', textAlignVertical: 'top', width: '80%', justifyContent: 'space-between', borderRadius: 10, height: 50, backgroundColor: colors.lightcolor1, marginLeft: 12, marginRight: 4 }}>
          <View style={{ width: '90%', justifyContent: 'center' }}>
            <Text>{this.state.selectedParent.MSG_TEXT}</Text>
          </View>
          <TouchableOpacity onPress={() => {
            this.setState({
              replyTriggered: false,
              selectedParent: {}
            })
          }} >
            <Image style={{ width: 25, height: 25 }} source={require('../../../../../assets/setting.png')} />
          </TouchableOpacity>
        </View> : null
    )
  }

  selectedMessageBottomBar() {
    return (
      this.state.longPressMessage ?
        <View style={{ alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row', textAlignVertical: 'top', width: '100%', justifyContent: 'space-between', borderRadius: 10, height: 50, backgroundColor: colors.lightcolor1 }}>
          <TouchableOpacity onPress={() => {
            this.setState({
              longPressMessage: false,
              selectedParent: {}
            })
          }} >
            <Image style={{ width: 25, height: 25 }} source={require('../../../../../assets/setting.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({
              longPressMessage: false,
              selectedParent: {}
            })
          }} >
            <Image style={{ width: 25, height: 25 }} source={require('../../../../../assets/setting.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({
              longPressMessage: false,
              selectedParent: {}
            })
          }} >
            <Image style={{ width: 25, height: 25 }} source={require('../../../../../assets/setting.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({
              longPressMessage: false,
              selectedParent: {}
            })
          }} >
            <Image style={{ width: 25, height: 25 }} source={require('../../../../../assets/setting.png')} />
          </TouchableOpacity>
        </View> : null
    )
  }

  longPressBar() {
    return;
  }

  sendButtonPress() {
    console.log('qwertyasdfghjkl');
    this.submitChatToChannel(this.state.chatboxtext)
  }


  submitChatToChannel(obj) {

  }

  processChatText(value) {

    this.state.chatboxtext = value;

    if (this.state.chatboxempty && value.length >= 1)
      this.setState({ chatboxempty: false });

    if (!this.state.chatboxempty && value.length < 1)
      this.setState({ chatboxempty: true });
  }

  updateChatTextboxHeight = (h) => {

    if (h > 100)
      h = 100;
    if (h < 30)
      h = 30;
    h = Math.floor(h);
    console.log(h);
    this.setState(prevState => ({
      chatbarstyle: {
        ...prevState.chatbarstyle,
        height: (24 + h)
      },
      chattextboxstyle: {
        ...prevState.chattextboxstyle,
        height: h + 8
      }
    }));
    /*       
    this.setState({
      chatbarstyle: { width:'100%', height: (16+h), backgroundColor: colors.darkcolor3 },
      chattextboxstyle: {width: 200, height:h, borderColor: colors.lightcolor1, borderWidth: 1}
    });
    */
  }

  mainBar() {
    return (
      <View style={styles.mainBarConatiner}>
        <TouchableOpacity style={styles.firstItemMainBar}></TouchableOpacity>
        {Platform.OS === 'ios' && <TextInput
          placeholder="Type here"
          placeholderTextColor="white"
          onChangeText={(value) => this.processChatText(value)}
          style={this.state.chattextboxstyle}
          //style={{overflow:'scroll'}}                 
          editable={true}
          multiline={true}
          autogrow={true}
          maxHeight={95}
          //value={value}                    
          onContentSizeChange={(e) => this.updateChatTextboxHeight(e.nativeEvent.contentSize.height)}
        />}

        {Platform.OS !== 'ios' && <JCTextInput
          placeholder="Type here Android"
          placeholderTextColor="white"
          onContentCommitEvent={(event) => { this.submitChatToChannel(event.nativeEvent); console.log(event.nativeEvent); console.log('Content Commit'); }}
          onChangeText={(value) => this.processChatText(value)}
          style={this.state.chattextboxstyle}
          //style={{overflow:'scroll'}}                 
          editable={true}
          multiline={true}
          autogrow={true}
          maxHeight={95}
          //value={value}                    
          onContentSizeChange={(e) => this.updateChatTextboxHeight(e.nativeEvent.contentSize.height)}
        />}
        {this.state.chatboxempty && <TouchableOpacity style={styles.secondItem}></TouchableOpacity>}
        {this.state.chatboxempty && <TouchableOpacity style={styles.thirdItem}></TouchableOpacity>}
        {!this.state.chatboxempty && <TouchableOpacity onPress={() => {
          console.log(this.props.activeChat.JID)
          this.props.sendReply(this.state.chatboxtext, this.props.activeChat.JID)
        }} style={styles.fourthItem}><Icon1 name='send' size={25} color='white' /></TouchableOpacity>}
      </View>)
  }


  onJewelPress(id) {
    console.log('wow>' + id);
  }

  onListEndReached() {
    db.getChats(this.props.activeChat.JID, this.props.chatroom.length)
      .then(results => {
        console.log('FROM JEWELCHAT COMPONENT GETCHAT SUCCESS')
        console.log(results.rows.length)
        if (results.rows.length > 0) {
          let chatroom = []
          for (let i = 0; i < results.rows.length; i++) {
            chatroom.push(results.rows.item(i))
          }
          var chatData = this.props.chatroom.concat(chatroom)
          this.props.setChatData(chatData)
        }
      })
      .catch(err => {
        console.log('FROM JEWELCHAT COMPONENT GETCHAT ERROR')
        console.log(err)
      })
  }



  render() {

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={105}
        style={styles.mainContainer}>

        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.subContainer}>
            <View style={this.state.chatbarstyle}>
              {this.mainBar()}
            </View>
            {this.repliesBar()}
            {this.selectedMessageBottomBar()}
            <FlatList
              //   removeClippedSubviews={true}
              style={styles.chatroom}
              inverted
              onEndReachedThreshold={0.7}
              data={this.props.chatroom}
              renderItem={({ item, index }) => (
                <ChatItem item={item} index={index}
                  onReplyTriggered={() => {
                    this.setState({
                      replyTriggered: true,
                      selectedParent: item
                    })
                  }}
                  onLongPress={() => {
                    this.setState({
                      longPressMessage: true,
                      selectedParent: item
                    })
                  }}
                  allchats={this.props.chatroom} onjewelpress={() => { this.onJewelPress(index) }} />
              )}
              onEndReached={() => {
                console.log('end reached')
                this.onListEndReached()
              }}
              keyExtractor={item => item._ID + ''}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}


class ChatItem extends React.Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY()
    this.myChat = props.item.CHAT_ROOM_JID !== props.item.CREATOR_JID ? true : false
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => { return !(gestureState.dx === 0 && gestureState.dy === 0) },
      onPanResponderMove: (event, gesture) => {
        let triggerstate
        if (this.myChat) {
          triggerstate = 100
        }
        else
          triggerstate = 150
        if (gesture.dx > triggerstate) {
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 0
          }).start()
        }
        else
          position.setValue({ x: gesture.dx, y: 0 })
      },
      onPanResponderRelease: (event, gesture) => {
        let triggerstate
        if (this.myChat) {
          triggerstate = 100
        }
        else
          triggerstate = 150
        console.log(triggerstate, this.myChat, gesture.dx)
        if (gesture.dx > triggerstate) {
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 0
          }
          ).start(() => {
            props.onReplyTriggered()
            console.log('triggered')
            Alert.alert('JewelChat', 'Reply Triggered')
          })
        }
        else {
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 0
          }
          ).start()
        }
      }
    })
    this.state = { position, panResponder }
  }

  render() {
    const { item, index, allchats, onjewelpress, onReplyTriggered, onLongPress } = this.props
    let sectionheader = false, mychat = false;
    if (!allchats[index + 1] || item.CREATED_DATE !== allchats[index + 1].CREATED_DATE)
      sectionheader = true;

    if (item.CHAT_ROOM_JID !== item.CREATOR_JID)
      mychat = true
    else
      mychat = false;

    return (
      <View style={styles.chatItemContainer}>

        {
          sectionheader &&
          <Text style={styles.createdDateStyle}>
            {item.CREATED_DATE}
          </Text>
        }

        {!mychat &&
          <View style={styles.friendMsgContainer}>
            {item.MAX_SEQUENCE - item.SEQUENCE < 5 || item.SEQUENCE == -1 ?
              <TouchableOpacity style={styles.jewelContainer} onPress={onjewelpress}>
                <J3 height="75%" width="75%" style={styles.jewelStyle} />
              </TouchableOpacity> : null}

            <Animated.View style={[styles.msgContainer, this.state.position.getLayout()]} {...this.state.panResponder.panHandlers}>
              <AnimatedTouchable style={styles.friendMsgTextContainer} onLongPress={() => onLongPress()}>
                <Text style={styles.friendMsgText}>{item.MSG_TEXT}</Text>
              </AnimatedTouchable>
              <Text style={styles.msgTime}>{item.CREATED_TIME}</Text>
            </Animated.View>
            {/* <View style={{ marginBottom: 10 }}>
              <CheckBox checked={true} color='#4287f5' />
            </View> */}
          </View>
        }

        {mychat &&
          <View style={styles.myMsgContainer}>
            <Animated.View style={[styles.msgContainer, this.state.position.getLayout()]} {...this.state.panResponder.panHandlers}>
              <AnimatedTouchable style={styles.myMsgTextConatiner} onLongPress={() => onLongPress()}>
                <Text style={styles.myMsgText}>{item.MSG_TEXT}</Text>
              </AnimatedTouchable>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={styles.msgTime}>{item.CREATED_TIME}</Text>
                {item.IS_READ || item.IS_DELIVERED ?
                  <Icon name='check-double' size={10} color={item.IS_READ ? colors.lightcolor1 : 'white'} /> :
                  item.IS_SUBMITTED ?
                    <Icon name='check' size={10} color={'white'} /> :
                    <Icon name='clock' size={10} color={'white'} />
                }
              </View>
            </Animated.View>
            {/* <View style={{ marginTop: 5, marginRight: 10 }}>
              <CheckBox checked={true} color='#4287f5' />
            </View> */}
          </View>
        }

      </View>
    )
  }
}






function mapStateToProps(state) {
  return {
    chatroom: state.chatroom.chatroom,
    activeChat: state.chatslist.activeChat,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    sendReply: (message, JID) => dispatch(sendReply(message, JID)),
    addChatMessage: (chatData) => dispatch(actions.addChatMessage(chatData)),
    sendReadReceipt: (JID) => dispatch(sendReadReceipt(JID)),
    setChatData: (id, offset) => dispatch(actions.setChatData(id, offset))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);