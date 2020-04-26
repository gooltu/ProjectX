import React from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    Text,
    ImageBackground
} from "react-native";

import { connect } from 'react-redux';

import colors from "../../shared_styles/colors";
import styles from './CustomHeader.styles'
import Logo from '../../svg_components/Logo';
import XP from '../../svg_components/XP';
import BackButton from "../../svg_components/BackButton";

import { realtimeConnect, realtimeDisconnect } from "../../../network/realtime"

class CustomHeader extends React.Component {
    componentDidMount() {
        console.log('CUSTOM HEADER MOUNT')
        console.log(this.props.navigation.state.routeName)
        //console.log(this.props.navigation.state.params)

        if (this.props.mytoken.token && this.props.appstate.state === 'active' && this.props.network.xmppState === 'XMPP_DISCONNECTED')
            console.log('CALL Connect strophe xmpp')
    }

    componentWillUnmount() {
        console.log('CUSTOM HEADER UNMOUNT')
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('CUSTOM HEADER STATE UPDATE')
        console.log(this.props.navigation.state.params);
        if (this.props.mytoken.token && this.props.appstate.state === 'active' && this.props.network.xmppState === 'XMPP_DISCONNECTED')
            console.log('CALL Connect strophe xmpp')
    }

    displayLogo() {
        let logoView
        if(this.props.navigation.state.routeName == 'ChatPage') 
            logoView =
            <TouchableOpacity style={styles.profilepic} onPress={()=>this.props.navigation.navigate('FriendProfile')}>
                {this.props.activeChat.SMALL_IMAGE == null ?
                    <ImageBackground
                        source={require('../../../assets/placeholder_img.png')}
                        style={styles.imgBackground}></ImageBackground> :
                    <ImageBackground
                        source={{ uri: this.props.activeChat.SMALL_IMAGE }}
                        style={styles.imgBackground}></ImageBackground>}
            </TouchableOpacity>
        else if(this.props.navigation.state.routeName == 'FriendProfile'){
            logoView = null
        }
        else
            logoView = <View style={styles.jewelBox}>
                <Logo height="100%" width="100%" />
            </View>
        return logoView
    }


    displayJewelBox() {
        return (
            <TouchableOpacity
                style={styles.jewelBox}
                onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'JStore' })}
            >
                <ImageBackground source={require('../../../assets/jewelbox.png')} style={{
                    width: '100%', height: '100%', justifyContent: 'center',
                    alignItems: 'center'
                }}>

                </ImageBackground>

            </TouchableOpacity>)
    }

    displayFactory() {
        let factoryView
        this.props.navigation.state.routeName == 'ChatPage' ?
            factoryView =
            <TouchableOpacity onPress={() => console.log('Chatlist dots Press')} style={styles.jewelBox}>
                <ImageBackground source={require('../../../assets/dots.png')} style={{
                    width: '100%', height: '100%', justifyContent: 'center',
                    alignItems: 'center'
                }}>
                </ImageBackground>
            </TouchableOpacity>
            :
            factoryView =
            <TouchableOpacity onPress={() => console.log('Factory Press')} style={styles.jewelBox}>
                <ImageBackground source={require('../../../assets/factory.png')} style={{
                    width: '100%', height: '100%', justifyContent: 'center',
                    alignItems: 'center'
                }}>
                </ImageBackground>
            </TouchableOpacity>
        return factoryView
    }

    displayBackButton() {
        console.log('test')
        console.log(this.props.navigation.state.routeName)
        console.log(
            this.props.navigation.dangerouslyGetParent().state
        )
        if (this.props.navigation.dangerouslyGetParent().state.index > 0 && this.props.navigation.state.routeName != 'MainTabs')
            return (<TouchableOpacity style={{ height: 32, width: 16, marginLeft: 8 }}
                onPress={() => { this.props.navigation.goBack() }} >
                <BackButton style={{ height: '100%', width: '100%' }} />
            </TouchableOpacity>)
        else
            return <View style={{ height: 32, width: 8, marginLeft: 4 }} />

    }

    displayTitle() {
        let titleView
        if(this.props.navigation.state.routeName == 'ChatPage')
            titleView = <TouchableOpacity onPress={()=>this.props.navigation.navigate('FriendProfile')} style={{ flexDirection: 'column', paddingLeft: 5, height: 32, justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>{this.props.activeChat.PHONEBOOK_CONTACT_NAME}</Text>
                <Text style={{ fontSize: 11, color: 'white' }}>online</Text>
            </TouchableOpacity>
            else if(this.props.navigation.state.routeName == 'FriendProfile'){
                titleView=  <Text style={{ fontSize: 16, color: 'white',paddingLeft:10, fontWeight: 'bold' }}>{this.props.activeChat.PHONEBOOK_CONTACT_NAME}</Text>
            }
            else
            titleView = <Text style={{ fontSize: 20, fontWeight: '500', color: 'white', textAlignVertical: 'center', paddingLeft: 16 }}>JewelChat</Text>
        return titleView
    }


    render() {
        console.log('Active Page ', this.props.navigation.dangerouslyGetParent());

        return (

            <View style={styles.mainContainer}>
                <View style={styles.subContainer}>
                    <View style={styles.headerLeft}>
                        {this.displayBackButton()}
                        {this.displayLogo()}
                        {this.displayTitle()}
                    </View>

                    <View style={styles.headerRight} >
                        {this.displayJewelBox()}
                        {this.displayFactory()}
                    </View>
                </View>

                <View style={styles.levelProgressContainer}>
                    <View style={styles.levelCount}>
                        <ImageBackground source={require('../../../assets/ColorGrad.jpg')} style={styles.imageBackground}>
                            <Text style={styles.count}>001</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.barContainer}>
                        <View style={styles.xpStyle}>
                            <XP height="100%" />
                        </View>
                        <View style={styles.progressBarOuterContainer}>
                            <View style={styles.progressBarInnerContainer}>
                                <View style={{ width: '75%', height: '100%' }}>
                                    <ImageBackground source={require('../../../assets/ColorGrad.jpg')} style={styles.progressBackground}></ImageBackground>
                                </View>
                            </View>
                            <View style={styles.levelData}>
                                <Text style={styles.levelDataText}>444/1000</Text>
                            </View>

                        </View>
                        <View style={styles.xpStyle}>
                            <XP height="100%" />
                        </View>
                    </View>
                </View>
            </View>
        );

    }

}


function mapStateToProps(state) {

    return {
        mytoken: state.mytoken,
        appstate: state.appstate,
        network: state.network,
        game: state.game,
        activeChat: state.chatslist.activeChat
    }
}

function mapDispatchToProps(dispatch) {

    return {
        openRealtimeConnection: () => dispatch(realtimeConnect()),
        closeRealtimeConnection: () => dispatch(realtimeDisconnect())
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);


/*<Text style={{fontSize:10, color:'white'}}>1</Text>  */