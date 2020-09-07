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
import { getContacts, renderJewel } from '../../../../JCUtils/CommonUtils'

export default class ChatItem extends React.Component {
    constructor(props) {
      super(props);      
          
    }

    renderJewel(item){
      
      return(
        <TouchableOpacity style={styles.jewelContainer}>
          {(item.MAX_SEQUENCE - item.SEQUENCE < 25 || item.SEQUENCE == -1) && !item.IS_JEWEL_PICKED 
            ? renderJewel(item.JEWEL_TYPE, "75%", "75%", styles.jewelStyle): null}
        </TouchableOpacity> 
      )
      
    }
  
    render() {
      const { item, index, allchats} = this.props

      

      let sectionheader = false, mychat = false;
      if (!allchats[index + 1] || item.CREATED_DATE !== allchats[index + 1].CREATED_DATE)
        sectionheader = true;
      
      this.mychat = this.props.item.SENDER_MSG_ID == null ? true : false;   
      
  
      return (
        <View style={styles.chatItemContainer}>
            
            {
              sectionheader &&
              <View style={styles.sectionheaderdate}>
                <Text>{item.CREATED_DATE}</Text>
              </View>
            }         
          
            <View style= {styles.MsgRow}>
              {this.renderJewel(item)}           
              <View style={styles.MsgContainer}> 
                <View style={ mychat ? styles.mychatbox : styles.friendschatbox }>                            
                  <Text style={styles.friendMsgText}>{item.MSG_TEXT}</Text>                
                  <Text style={styles.msgTime}>{item.CREATED_TIME}</Text>
                </View>      
              </View>  
            </View>               
  
        </View>
      )
    }
  }