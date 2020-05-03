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



class Contacts extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    
    console.log('HERE');
    return {
      header: <CustomHeader levelbar="show" />
    };
};*/
constructor(props){
  super(props)
  this.state={
    searchQuery :''
  }
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
          style={{backgroundColor:colors.darkcolor3, color:'white'}}
          inputStyle={{color:'white',fontSize:14}}
          placeholderTextColor = 'white'
          iconColor='white'
          theme='dark'
        />
        <FlatList
          data={this.props.chatslist}
          renderItem={({ item }) => (
            <Item item={item}
              onpressitem={(item) => {
                // this.props.setActiveDispatch(item)  
                // this.props.navigation.navigate('ChatPage', item)
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
        <View style={styles.itemLeftSubContainer}>
          <Text style={styles.inviteText}>{item.IS_REGIS == 0 ? 'INVITE' : ''}</Text>
        </View>
        <View style={styles.marginStyleLeft} />
      </View>
    </TouchableOpacity>
  );
}

function mapStateToProps(state) {
  return {
    chatslist: state.chatslist.chatList
  }
}


function mapDispatchToProps(dispatch) {
  return {
    //  setActiveDispatch: (activeChat) => dispatch(setActiveDispatch(activeChat))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Contacts);