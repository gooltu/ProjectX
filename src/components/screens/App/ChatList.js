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

import Logo from '../../svg_components/Logo';
import Coin from '../../svg_components/Coin';
import Diamond from '../../svg_components/Diamond';
import J3 from '../../svg_components/J3';
import J6 from '../../svg_components/J6';
import TabIcon from "../../svg_components/TabIcons";


import colors from "../../shared_styles/colors";






function Item({ item , onpressitem, onlongpressitem }) { 
  
  
  return (
    <TouchableOpacity
      onPress={() => onpressitem(item)}
      onLongPress={() => onlongpressitem(item._ID)}
      style={{ flexDirection: "row", width:'100%', height: 64, borderBottomWidth: 1,  borderColor: colors.darkcolor2, backgroundColor: colors.darkcolor1}}
    >
      <View
        style={{
            flex:1,
            flexDirection: "row",
            justifyContent: "flex-start",            
            height: '100%'                                    
        }}
      >
        <View style={{height:64, width: 8, marginLeft: 4 }}/>
        <View 
            style={{
                height: 48,
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: 'white',
                borderRadius: 24,
                marginTop: 8,   
                marginRight:8,             
                borderWidth:StyleSheet.hairlineWidth,
                overflow:'hidden'
            }}
          >
            { item.SMALL_IMAGE && item.JEWELCHAT_ID != 1 &&
              <ImageBackground 
                source={{ uri: item.SMALL_IMAGE }}
                style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow:'hidden'}}></ImageBackground>
            } 

            {
              item.JEWELCHAT_ID == 1 && <Logo height="75%" width="75%" style={{ margin : 10, width: '100%', height: '100%',  alignItems: 'center', overflow:'hidden'  }} />
            }
            

            { 
              !item.SMALL_IMAGE && item.JEWELCHAT_ID != 1 && <J6 height="75%" width="75%" style={{ margin : 10, width: '100%', height: '100%',  alignItems: 'center', overflow:'hidden'  }} />
              
            } 

        </View>
        <View
                style={{
                        height: 64,                        
                        marginTop: 8,
                        marginLeft:8
                      }}
        >
          <Text style={{color:'white', fontSize:12, fontWeight:'600', padding: 4}}>{ item.PHONEBOOK_CONTACT_NAME ? item.PHONEBOOK_CONTACT_NAME : (item.JEWELCHAT_ID == 1 ? 'Team JewelChat': '+'+item.CONTACT_NUMBER ) }</Text> 
          <Text style={{color:colors.jcgray, fontSize:10, fontWeight:'normal', padding:4}}>{item.MSG_TEXT.substring(0, 25) + (item.MSG_TEXT.length >25 ? '...': '')}</Text>           
        </View>

                                
      </View>
      <View
        style={{
            flex:1,
            flexDirection: "row",
            justifyContent: "flex-end",            
            height: '100%'
        }}
      >
        
        <View
                style={{
                        height: 64,                        
                        marginTop: 8,
                        marginLeft:8,
                        alignItems:'center'
                      }}
        >

          <Text style={{ color:colors.jcgray, fontSize:10, fontWeight:'normal', padding:4 }}>{relativeDateSting(item.LAST_MSG_CREATED_TIME)}</Text>

         {item.UNREAD_COUNT > 0 &&
          <View style = {{ minWidth: 22 , minHeight: 22, backgroundColor:colors.lightcolor2, borderRadius:11, padding:4, borderWidth:1, overflow:'hidden', borderColor:colors.lightcolor2, justifyContent: 'center', alignItems: 'center' }}>
            <Text 
              style={{ fontSize:10, color:'white' }} >
              {item.UNREAD_COUNT}  
            </Text>
          </View> 
         }           
        </View>
        <View style={{height:64, width: 8, marginLeft: 4 }}/>

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
      <View style={{backgroundColor:colors.darkcolor1, height:'100%', width: '100%'}}>       
        
        <Provider>
          <Portal>  


            <FlatList
              data= {this.props.chatslist}
              renderItem={ ( {item} ) => (
                <Item item = {item}                  
                  onpressitem = { (item) => {this.props.navigation.navigate('ChatPage', item )}} 
                  onlongpressitem = { (id) => {this.props.navigation.navigate('MyModal', { modal_name: 'chatlist_longpress', item } )}}
                />           
              )}
              keyExtractor={item => item._ID+''}
            />          

            <FAB.Group
              style={{ paddingBottom: 30 }}
              fabStyle={{backgroundColor: colors.lightcolor2}}
              color={'white'}
              open={this.state.open}
              icon={this.state.open ? 'today' : 'add'}
              actions={[                                
                { icon: 'email', label: 'New Group', color: 'white' ,style: { backgroundColor: colors.lightcolor2 } , onPress: () => console.log('Pressed email') },
                { icon: 'notifications', label: 'Contacts', color: 'white' ,style: { backgroundColor: colors.lightcolor2 }, onPress: () => console.log('Pressed notifications') },
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: colors.darkcolor1
  },
  button: {
    height: 50,
    width: 250,
    alignItems: "center",    
    marginRight:40,
    marginLeft:40,
    marginTop:100,
    /*
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    */
    backgroundColor: colors.lightcolor1,
    borderRadius:10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#00000000',
    overflow:'hidden'    
  },
  buttontext: {
    color: 'white',
    textAlign:'center',
    fontSize: 18,
    fontWeight: "600"
  }
});


function relativeDateSting(last_msg_time){

  let date  = new Date(Number(last_msg_time)); 

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
  }else{
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
        chatslist: state.chatslist        
	}
}


function mapDispatchToProps(dispatch) {
	return {    
                       
	}
}


export default connect(mapStateToProps, mapDispatchToProps )(ChatList);
