import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  InputAccessoryView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity
} from 'react-native';
import JCTextInput from "../../../../../utilities/JCTextInput/JCTextInput";
import styles from './ChatPage.styles'
import colors from "../../../../shared_styles/colors";
import J6 from '../../../../svg_components/J6';
import J3 from '../../../../svg_components/J6';
import { connect } from 'react-redux';
class ChatPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //console.log(this.props.navigation.state.routes[this.props.navigation.state.index]);
    console.log(this.props.navigation.setParams({ otherParam: 'Updated!' }));
    //console.log(this.props);
    //console.log(this.props.navigation.state.routeName);
  }

  state = {
    chatboxtext: '',
    chatboxempty: true,
    replybarshow: false,
    longpressbarshow: false,
    chatbarstyle: { width: '100%', height: 36, backgroundColor: colors.darkcolor3 },
    chattextboxstyle: { flexGrow: 1, maxWidth: '80%', height: 24, borderColor: colors.lightcolor1, borderWidth: 1, borderRadius: 10, color: 'white', fontSize: 14, backgroundColor: colors.darkcolor3, padding: 5, overflow: 'scroll', textAlignVertical: 'top', marginLeft: 4, marginRight: 4 }
  }


  repliesBar() {
    return;
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
        {!this.state.chatboxempty && <TouchableOpacity style={styles.fourthItem}></TouchableOpacity>}
      </View>)
  }


  onJewelPress(id) {
    console.log('wow>' + id);
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
            <FlatList
              style={styles.chatroom}
              inverted
              data={this.props.chatroom}
              renderItem={({ item, index }) => (
                <ChatItem item={item} index={index} allchats={this.props.chatroom} onjewelpress={() => { this.onJewelPress(index) }} />
              )}
              keyExtractor={item => item._ID + ''}
            />

          </View>
        </SafeAreaView>

      </KeyboardAvoidingView>
    );
  }
}


function ChatItem({ item, index, allchats, onjewelpress }) {

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
          <TouchableOpacity style={styles.jewelContainer} onPress={onjewelpress}>
            <J3 height="75%" width="75%" style={styles.jewelStyle} />
          </TouchableOpacity>
          {/* <View style={{ flex:1, flexDirection:'column',backgroundColor:'blue', maxWidth:200}}>
              <Text>{item.MSG_TEXT}</Text>
              <Text style={{ alignSelf:'flex-end'}}>{item.CREATED_TIME}</Text>
            </View> */}
          <View style={styles.msgContainer}>
            <Text style={styles.friendMsgText}>{item.MSG_TEXT}</Text>
            <Text style={styles.msgTime}>{item.CREATED_TIME}</Text>
          </View>
        </View>
      }

      {mychat &&
        <View style={styles.myMsgContainer}>
          <View style={styles.msgContainer}>
            <Text style={styles.myMsgText}>{item.MSG_TEXT}</Text>
            <Text style={styles.msgTime}>{item.CREATED_TIME}</Text>
          </View>
        </View>
      }

    </View>
  );
}





function mapStateToProps(state) {
  return {
    chatroom: state.chatroom
  }
}


function mapDispatchToProps(dispatch) {
  return {

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);