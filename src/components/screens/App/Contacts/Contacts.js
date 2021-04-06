import React from "react";
import {
  ActivityIndicator,  
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Text,
  ImageBackground,
  SafeAreaView
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
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
import CustomLoader from '../../../shared_components/CustomLoader'

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
      displayContactData: [],
      contactData: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
    this.getContactsCallback()
    getContacts(this.getContactsCallback, this.props.mytoken.myphone)
  }

  getContactsCallback = (query) => {
       
    db.getContactList('Contact', query).then(results => {   
      console.log('JC CONTACTS', results);       
      this.setState({
        contactData: results,        
        isLoading: false
      })
    }).catch(err => {
      console.log(err)
    })

  }

  _onChangeSearch = (query) => {    
    // if (query.length > 0) {
    //   var filteredContacts = this.state.contactData.filter(item => {
    //     return item.PHONEBOOK_CONTACT_NAME.toLowerCase().includes(query.toLowerCase())
    //   })
    //   this.setState({
    //     displayContactData: filteredContacts
    //   })
    // }
    // else {
    //   this.setState({
    //     displayContactData: this.state.contactData
    //   })
    // }

    // this.setState({
    //   searchQuery: query
    // })

    this.getContactsCallback()

  }


  inviteUser(item) {
    console.log('INVITE USER',item)
    if( item.IS_REGIS == 0 ){
  
        let data = {
          phone: item.CONTACT_NUMBER
        }
        NetworkManager.callAPI(rest.inviteUser, 'post', data).then(result => {
            console.log(result)       
            if(result.is_regis && result.invite == 0){
                let contact = {
                  JEWELCHAT_ID: result.contact.id,
                  IS_REGIS: 1,
                  IS_INVITED: 0,
                  STATUS_MSG: result.contact.status
                }
                db.updateContact(contact, item.CONTACT_NUMBER).then(result => {
                  this.getContactsCallback()
                }) 
            }else if(!result.is_regis && result.invite == 1){
                db.updateContact({IS_INVITED:1}, item.CONTACT_NUMBER).then(result => {
                  this.getContactsCallback()

                  let  t = this.props.referralAchievement
                  if( t['1'] ){
                    t['1'].total_count++
                  }else{
                    t['1'] = { total_count : 1 }
                  }

                  this.props.setReferralAchievement( {type:'UPDATE_REFERRAL_ACHIEVEMENTS', payload: Object.create(t)} )
                  
                })     
            }else{
                // User has already invited previously so marking it as invited but not increasing the game metrics
                db.updateContact({IS_INVITED:1}, item.CONTACT_NUMBER).then(result => {
                  this.getContactsCallback()                
                })
            }   
            
        
        }).catch(error => {
          console.log(error)
        })
    
   
  
    }else{   
         
        let activechatobj = Object.assign({}, item, { CHAT_ROOM_JID : item.JID });
        this.props.setActiveChat(activechatobj)
        this.props.navigation.navigate('ChatPage', activechatobj)
    }
  
  }


  Item = ({item}) =>  (

    <TouchableOpacity onPress={() => this.inviteUser(item)}  style={styles.mainConatiner} >
      <View style={styles.subContainer}>
        <View style={styles.marginstyle} />
        <View style={styles.chatBox}>
          {/* {item.IS_REGIS == 1 &&
            <ImageBackground
              source={{ uri: item.SMALL_IMAGE }}
              style={styles.imgBackground}></ImageBackground> */
          }                  
          {
            item.IS_REGIS == 0 && <Icon  name='user' color={colors.jcgray} size={24} solid />
          }
        </View>      
        <View style={styles.chatboxLeftContainer} >
          <Text style={styles.name}>{item.PHONEBOOK_CONTACT_NAME ? item.PHONEBOOK_CONTACT_NAME : 'NA'}</Text>
          <Text style={styles.msgText}>{item.CONTACT_NUMBER}</Text>
          <Text style={styles.msgText}>{item.STATUS_MSG != null ? item.STATUS_MSG.substring(0, 25) + (item.STATUS_MSG.length > 25 ? '...' : '') : ''}</Text>
        </View>
      </View>
      <View style={styles.itemLeftConatiner} >
        <View style={styles.itemLeftSubContainer}>
          {item.IS_REGIS == 0 && item.IS_INVITED == 0 && <Text style={styles.inviteText}>INVITE</Text>}
          {item.IS_REGIS == 0 && item.IS_INVITED == 1 && <Text style={styles.invitedText}>INVITED</Text>}
        </View>
        <View style={styles.marginStyleLeft} />
      </View>
    </TouchableOpacity>
  );
  

  render() {
    return (
      <SafeAreaView style={styles.rootContainer}>
        <CustomLoader loading={this.state.isLoading} />
        <Searchbar
          placeholder="Search Contacts"
          //onChangeText={ (query) => { console.log('came to callback', query); this._onChangeSearch(query) }}
          onChangeText={ (query) => { console.log('came to callback', query); this.getContactsCallback(query) }}
          //value={this.state.searchQuery}
          style={{ backgroundColor: colors.darkcolor3, color: 'white' }}
          inputStyle={{ color: 'white', fontSize: 14 }}
          placeholderTextColor='white'
          iconColor='white'
          theme='dark'
        />
        <FlatList
          data={this.state.contactData}
          renderItem={(item) => this.Item(item)}           
          keyExtractor={item => item._ID + ''}
        />
        <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      </SafeAreaView>
    );
  }
}





function mapStateToProps(state) {
  return { 
    referralAchievement: state.referralAchievement,
    mytoken: state.mytoken 
  }
}


function mapDispatchToProps(dispatch) {
  return {
    setActiveChat: (activeChat) => dispatch(actions.setActiveChat(activeChat)),
    setChatListData: (chatList) => dispatch(actions.setChatListData(chatList)),
    setChatData: (chatdata) => dispatch(actions.setChatData(chatdata)),
    setReferralAchievement: (referralAchievement) => dispatch(referralAchievement)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Contacts);