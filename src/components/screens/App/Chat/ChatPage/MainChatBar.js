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
import JCTextInput from "../../../../../utilities/JCTextInput/JCTextInput";
import { connect } from 'react-redux';
import colors from "../../../../shared_styles/colors";
import Icon1 from 'react-native-vector-icons/MaterialIcons'


import { sendReply, sendSubscriptionRequest } from '../../../../../network/realtime'


class MainChatBar extends React.Component {

    constructor(props) {
        super(props);
      }


    state = {
        chatboxtext: '',  
        chatboxempty: true,
        chatbarstyle: { width: '100%', height: 36, backgroundColor: colors.darkcolor3 },
        chattextboxstyle: { flexGrow: 1, maxWidth: '80%', height: 24, borderColor: colors.lightcolor1, borderWidth: 1, borderRadius: 10, color: 'white', fontSize: 14, backgroundColor: colors.darkcolor3, padding: 5, overflow: 'scroll', textAlignVertical: 'top', marginLeft: 4, marginRight: 4 }
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
        //console.log(h);
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


      render(){

        return (
        <View style={this.state.chatbarstyle}>
            <View style={styles.mainBarConatiner}>
              <TouchableOpacity style={styles.firstItemMainBar}></TouchableOpacity>
              {Platform.OS === 'ios' && <TextInput
                placeholder="Type here"
                placeholderTextColor="white"
                onChangeText={(value) => this.processChatText(value)}
                style={this.state.chattextboxstyle}
                //style={{overflow:'scroll'}}                 
                editable={true}
                ref={ref => {
                  this.textInput = ref;
                }}
                multiline={true}
                autogrow={true}
                maxHeight={95}
                //value={value}                    
                onContentSizeChange={(e) => this.updateChatTextboxHeight(e.nativeEvent.contentSize.height)}
              />}
      
              {Platform.OS !== 'ios' && <JCTextInput
                placeholder="Type here Android"
                placeholderTextColor="white"
                ref={ref => {
                  this.textInput = ref;
                }}
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
                this.textInput.clear();
                if (this.props.activeChat.IS_PHONEBOOK_CONTACT == 1 && this.props.chatroom.length == 0) {
                  this.props.sendSubscriptionRequest(this.props.activeChat.JID)
                }
                console.log(this.state.replyTriggered, this.state.selectedParent)
                if (this.state.replyTriggered) {
                  this.props.sendReply(this.state.chatboxtext, this.props.activeChat.JID, 'reply', this.state.selectedParent._ID)
                  this.setState({
                    replyTriggered: false
                  })
                }
                else
                  this.props.sendReply(this.state.chatboxtext, this.props.activeChat.JID)
      
              }} style={styles.fourthItem}><Icon1 name='send' size={25} color='white' /></TouchableOpacity>}
            </View>
        </View>  
          
          );

      }

}

function mapStateToProps(state) {
  return {    
  }
}


function mapDispatchToProps(dispatch) {
  return {
    sendReply: (message, JID, type = 'normal', parent = null) => dispatch(sendReply(message, JID, type, parent)),
    sendSubscriptionRequest: (JID) => dispatch(sendSubscriptionRequest(JID))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainChatBar);