import React from 'react';
import {  
  View,
  Text,  
  TouchableOpacity
} from 'react-native';

import FastImage from 'react-native-fast-image'
import styles from './ChatPage.styles'
import JCTextInput from "../../../../../utilities/JCTextInput/JCTextInput";
import { connect } from 'react-redux';
import colors from "../../../../shared_styles/colors";
import { getContacts, renderJewel } from '../../../../JCUtils/CommonUtils'
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class ChatItem extends React.PureComponent {
    constructor(props) {
      super(props);      
         
    }

     

    state = {    
      mychat: false
    }

    componentDidMount() {
      let me = this.props.userJID.myphone+'@jewelchat.net';
      //console.log('CHAT CREATOR', this.props);
      let mychat = (me===this.props.item.CREATOR_JID ? true : false)
      this.setState({mychat});       
    }

    renderJewel(){
      //console.log('Jewel');

        if( this.props.item.IS_JEWEL_PICKED == 0 ){

            return(
              !this.state.mychat &&  
                <TouchableOpacity style={styles.jewelContainer} onPress={this.props.onjewelpress}>
                  {
                    (this.props.item.MAX_SEQUENCE - this.props.item.SEQUENCE < 25 || this.props.item.SEQUENCE == -1)               
                    ? renderJewel(this.props.item.JEWEL_TYPE, "75%", "75%", styles.jewelStyle)
                    : null
                  }
                </TouchableOpacity> 
            )

        }else if( this.props.item.IS_JEWEL_PICKED == 2 ){      
            return(
              !this.state.mychat &&  
                <TouchableOpacity style={styles.jewelContainer} onPress={this.props.onjewelpress}>
                  {
                    (this.props.item.MAX_SEQUENCE - this.props.item.SEQUENCE < 25 || this.props.item.SEQUENCE == -1)               
                    ? renderJewel(this.props.item.JEWEL_TYPE, "25%", "25%", styles.jewelStyle)
                    : null
                  }
                </TouchableOpacity> 
            )    
        }else 
          return(
            !this.state.mychat &&  
              <TouchableOpacity style={styles.jewelContainer} onPress={this.props.onjewelpress}></TouchableOpacity> 
          );      
      
    }

    renderTextMsg(marker){     
      console.log('TEXT',this.props.item.MSG_TYPE)
      return(
        <View style={[ styles.chatbox, this.state.mychat ? styles.mychatbox : styles.friendschatbox ]}>                                  
              <Text style={styles.friendMsgText}>{this.props.item.MSG_TEXT}</Text> 
              <View style={this.state.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { marker == 0 && <Icon style={{paddingRight:5, paddingTop:2}} name='clock' size={9} color={colors.jcgray} /> }
                { marker == 1 && <Icon style={{paddingRight:5, paddingTop:2}} name='check' size={9} color={colors.jcgray} /> }
                { marker == 2 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.jcgray} /> }
                { marker == 3 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.darkcolor1} /> }
                { !this.state.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+{this.props.item.CREATOR_JID.split('@')[0]}</Text> : null }
              </View>  
        </View>
      )
      
    }


    renderImageMsg(marker){      
      console.log('IMAGE')
      return(
        <TouchableOpacity style={[ styles.chatbox, this.state.mychat ? styles.mychatbox : styles.friendschatbox ]} onPress={this.props.onmediapress}>    
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
              <View style={this.state.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { marker == 0 && <Icon style={{paddingRight:5, paddingTop:2}} name='clock' size={9} color={colors.jcgray} /> }
                { marker == 1 && <Icon style={{paddingRight:5, paddingTop:2}} name='check' size={9} color={colors.jcgray} /> }
                { marker == 2 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.jcgray} /> }
                { marker == 3 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.darkcolor1} /> }
                { !this.state.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View> 
        </TouchableOpacity>
      )
      
    }


    renderVideoMsg(marker){     
      
      return(
        <TouchableOpacity style={[ styles.chatbox, this.state.mychat ? styles.mychatbox : styles.friendschatbox ]} onPress={this.props.onmediapress} >                                  
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
              <View style={this.state.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { marker == 0 && <Icon style={{paddingRight:5, paddingTop:2}} name='clock' size={9} color={colors.jcgray} /> }
                { marker == 1 && <Icon style={{paddingRight:5, paddingTop:2}} name='check' size={9} color={colors.jcgray} /> }
                { marker == 2 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.jcgray} /> }
                { marker == 3 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.darkcolor1} /> }
                { !this.state.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>   
        </TouchableOpacity>
      )
      
    }


    renderGifMsg(marker){
      console.log('GIF',this.props.item.MSG_TYPE)
      
      return(
        <TouchableOpacity style={[ styles.chatbox, this.state.mychat ? styles.mychatbox : styles.friendschatbox ]} onPress={this.props.onmediapress} >                                  
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
              <View style={this.state.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { marker == 0 && <Icon style={{paddingRight:5, paddingTop:2}} name='clock' size={9} color={colors.jcgray} /> }
                { marker == 1 && <Icon style={{paddingRight:5, paddingTop:2}} name='check' size={9} color={colors.jcgray} /> }
                { marker == 2 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.jcgray} /> }
                { marker == 3 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.darkcolor1} /> }
                { !this.state.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>  
        </TouchableOpacity>
      )
      
    }


    renderStickerMsg(marker){     
      console.log('STICKER',this.props.item.MSG_TYPE)
      return(
        <TouchableOpacity style={[ styles.chatbox, this.state.mychat ? styles.mychatbox : styles.friendschatbox, { backgroundColor: 'transparent' } ]} onPress={this.props.onmediapress}>                                  
              <View style={{ justifyContent:'center', alignSelf:'center', marginTop:1 }}>
                  
                                    
                  
                  <FastImage
                      style={{width: 100, height: 100, borderRadius: 5, backgroundColor: 'transparent' }}
                      source={{
                          uri: this.props.item.MEDIA_CLOUD
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                  />
                  
                
              </View> 
              <View style={[this.state.mychat ? styles.mychatboxBottomStrip : styles.friendschatboxBottomStrip,{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5} ,this.state.mychat ? { backgroundColor: colors.lightcolor2} : { backgroundColor: 'white' }]}>                
                <Text style={styles.msgTime}>{this.props.item.CREATED_TIME}</Text>
                { marker == 0 && <Icon style={{paddingRight:5, paddingTop:2}} name='clock' size={9} color={colors.jcgray} /> }
                { marker == 1 && <Icon style={{paddingRight:5, paddingTop:2}} name='check' size={9} color={colors.jcgray} /> }
                { marker == 2 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.jcgray} /> }
                { marker == 3 && <Icon style={{paddingRight:5, paddingTop:2}} name='check-double' size={9} color={colors.darkcolor1} /> }
                { !this.state.mychat && this.props.item.IS_GROUP_MSG == 1 ? <Text style={styles.groupMsgSender}>+919005835709</Text> : null }
              </View>  
        </TouchableOpacity>
      )
      
    }
  
    render() {      

      
      if (!this.props.allchats[this.props.index + 1] || this.props.item.CREATED_DATE !== this.props.allchats[this.props.index + 1].CREATED_DATE)
        this.sectionheader = true;
      
      
      let marker;
      if(this.state.mychat){        
          if(this.props.item.IS_READ == 1)
            marker = 3;
          else if(this.props.item.IS_DELIVERED == 1)
            marker = 2;
          else if(this.props.item.IS_SUBMITTED == 1)
            marker = 1; 
          else 
            marker = 0;         
      }
  
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

                  this.props.item.MSG_TYPE == 0 ? this.renderTextMsg(marker)
                  : (this.props.item.MSG_TYPE == 1 ? this.renderImageMsg(marker) 
                  : (this.props.item.MSG_TYPE == 2 ? this.renderVideoMsg(marker)
                  : (this.props.item.MSG_TYPE == 3 ? this.renderGifMsg(marker)
                  : (this.props.item.MSG_TYPE == 4 ? this.renderStickerMsg(marker) : null ) ) ) )

                } 
                      
              </View>  
            </View>               
  
        </View>
      )
    }
  }