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

import FastImage from 'react-native-fast-image'
import styles from './ChatPage.styles'
import JCTextInput from "../../../../../utilities/JCTextInput/JCTextInput";
import { connect } from 'react-redux';
import colors from "../../../../shared_styles/colors";
import { getContacts, renderJewel } from '../../../../JCUtils/CommonUtils'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class ChatItem extends React.Component {
    constructor(props) {
      super(props);      
          
    }

    renderJewel(){
      //console.log('Jewel');
      return(
        !this.mychat &&  <TouchableOpacity style={styles.jewelContainer}>
          {(this.props.item.MAX_SEQUENCE - this.props.item.SEQUENCE < 25 || this.props.item.SEQUENCE == -1) && this.props.item.IS_JEWEL_PICKED == 0 
            ? renderJewel(this.props.item.JEWEL_TYPE, "75%", "75%", styles.jewelStyle): null}
        </TouchableOpacity> 
      )
      
    }

    renderTextMsg(){
      
      return(
        <View style={[ styles.chatbox, this.mychat ? styles.mychatbox : styles.friendschatbox ]}>                                  
              <Text style={styles.friendMsgText}>{this.props.item.MSG_TEXT}</Text> 
              <View style={this.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { !this.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>  
        </View>
      )
      
    }


    renderImageMsg(){     
      
      return(
        <View style={[ styles.chatbox, this.mychat ? styles.mychatbox : styles.friendschatbox ]}>    
              <View style={{ justifyContent:'center', alignSelf:'center', marginTop:1 }}>
                  
                  <Icon style={{ position:'absolute', top:40, left:40}} name='image' size={20} color='black' />                    
                  
                  <FastImage
                      style={{width: 100, height: 100, borderRadius: 5, backgroundColor: 'transparent' }}
                      source={{
                          uri: this.props.item.MEDIA_CLOUD
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  
                
              </View>  
              <View style={this.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { !this.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View> 
        </View>
      )
      
    }


    renderVideoMsg(){
      
      return(
        <View style={[ styles.chatbox, this.mychat ? styles.mychatbox : styles.friendschatbox ]}>                                  
              <View style={{ justifyContent:'center', alignSelf:'center', marginTop:1 }}>
                  
                  <Icon style={{ position:'absolute', top:40, left:40}} name='play-circle' size={20} color='black' />                    
                  
                  <FastImage
                      style={{width: 100, height: 100, borderRadius: 5, backgroundColor: 'transparent' }}
                      source={{
                          uri: this.props.item.MEDIA_CLOUD
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                  />

                  <Icon style={{ position:'absolute', top:40, left:40}} name='play-circle' size={20} color='black' /> 
                
              </View>
              <View style={this.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { !this.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>   
        </View>
      )
      
    }


    renderGifMsg(){
      
      return(
        <View style={[ styles.chatbox, this.mychat ? styles.mychatbox : styles.friendschatbox ]}>                                  
              <View style={{ justifyContent:'center', alignSelf:'center', marginTop:1 }}>
                  
                  <Icon style={{ position:'absolute', top:40, left:40}} name='image' size={20} color='black' />                    
                  
                  <FastImage
                      style={{width: 100, height: 100, borderRadius: 5, backgroundColor: 'transparent' }}
                      source={{
                          uri: this.props.item.MEDIA_CLOUD
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  
                
              </View> 
              <View style={this.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { !this.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>  
        </View>
      )
      
    }


    renderStickerMsg(){
      
      return(
        <View style={[ styles.chatbox, this.mychat ? styles.mychatbox : styles.friendschatbox, { backgroundColor: 'transparent' } ]}>                                  
              <View style={{ justifyContent:'center', alignSelf:'center', marginTop:1 }}>
                  
                                    
                  
                  <FastImage
                      style={{width: 100, height: 100, borderRadius: 5, backgroundColor: 'transparent' }}
                      source={{
                          uri: this.props.item.MEDIA_CLOUD
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                  />
                  
                
              </View> 
              <View style={[this.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip,{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5} ,this.mychat ? { backgroundColor: colors.lightcolor2} : { backgroundColor: 'white' }]}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { !this.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>  
        </View>
      )
      
    }
  
    render() {      

      
      if (!this.props.allchats[this.props.index + 1] || this.props.item.CREATED_DATE !== this.props.allchats[this.props.index + 1].CREATED_DATE)
        this.sectionheader = true;
      
      this.mychat = this.props.item.SENDER_MSG_ID == null ? true : false;   
      
  
      return (
        <View style={styles.chatItemContainer}>
            
            {
              this.sectionheader &&
              <View style={styles.sectionheaderdate}>
                <Text>{this.props.item.CREATED_DATE}</Text>
              </View>
            }         
          
            <View style= {styles.MsgRow}>
              {this.renderJewel()}           
              <View style={styles.MsgContainer}>
                {

                  this.props.item.MSG_TYPE == 0 ? this.renderTextMsg()
                  : (this.props.item.MSG_TYPE == 1 ? this.renderImageMsg() 
                  : (this.props.item.MSG_TYPE == 2 ? this.renderVideoMsg()
                  : (this.props.item.MSG_TYPE == 3 ? this.renderGifMsg()
                  : (this.props.item.MSG_TYPE == 4 ? this.renderStickerMsg() : null ) ) ) )

                } 
                      
              </View>  
            </View>               
  
        </View>
      )
    }
  }