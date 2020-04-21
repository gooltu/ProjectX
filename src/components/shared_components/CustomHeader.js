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

import colors from "../shared_styles/colors";

import Logo from '../svg_components/Logo';
import XP from '../svg_components/XP';
import BackButton from "../svg_components/BackButton";

import { realtimeConnect, realtimeDisconnect } from "../../network/realtime"

//import Shimmer from 'react-native-shimmer';






class CustomHeader extends React.Component {


    componentDidMount() {
        console.log('CUSTOM HEADER MOUNT')
        console.log(this.props.navigation.state.routeName)
        //console.log(this.props.navigation.state.params)

        if( this.props.mytoken.token && this.props.appstate.state === 'active' && this.props.network.xmppState === 'XMPP_DISCONNECTED' )
            console.log('CALL Connect strophe xmpp')
    }
    
    componentWillUnmount() {
        console.log('CUSTOM HEADER UNMOUNT')
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('CUSTOM HEADER STATE UPDATE')
        console.log(this.props.navigation.state.params);
        if( this.props.mytoken.token && this.props.appstate.state === 'active' && this.props.network.xmppState === 'XMPP_DISCONNECTED' )
            console.log('CALL Connect strophe xmpp')
    }

    displayLogo(){
        return (
            <View 
                style={{
                    height: 32,
                    width: 32,                            
                    marginLeft: 8,
                    marginRight: 8
                }}
            >
                    <Logo height="100%" width="100%" />
            </View>)
    }


    displayJewelBox(){
        return (
            <TouchableOpacity 
                style={{
                    height: 32,
                    width: 32,                            
                    marginLeft: 8,
                    marginRight: 8
                }}
                onPress = {() => this.props.navigation.navigate('MyModal', {modal_name: 'JStore'})} 
            >
                    <ImageBackground source={require('../../assets/jewelbox.png')} style={{width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center'}}>
                             
                    </ImageBackground>

            </TouchableOpacity>)
    }

    displayFactory(){
        return (
            <TouchableOpacity 

                onPress = {() => console.log('Factory Press')}

                style={{
                    height: 32,
                    width: 32,                            
                    marginLeft: 8,
                    marginRight: 8
                }}
            >
                    <ImageBackground source={require('../../assets/factory.png')} style={{width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center'}}>
                             
                    </ImageBackground>

            </TouchableOpacity>)
    }

    displayBackButton(){

        if(this.props.navigation.dangerouslyGetParent().state.index>0)
                return (<TouchableOpacity style={{height:32, width: 16, marginLeft: 8 }} 
                            onPress={() => { this.props.navigation.goBack()}} >
                            <BackButton style={{height:'100%', width:'100%'}}/>
                        </TouchableOpacity>)
        else
                return <View style={{height:32, width: 8, marginLeft: 4 }}/>            
               
    }

    displayTitle(){

        return (    
                
                    <Text style={{ fontSize:20, fontWeight:'500', color: 'white', textAlignVertical:'center', paddingLeft:16 }}>JewelChat</Text>
              
                )
        
    }


    render() {
        //console.log(this.props.navigation.dangerouslyGetParent());

        return (

            <View
                style={{
                    height: 105,
                    width: "100%",
                    flexDirection: "column",
                    backgroundColor: colors.darkcolor1
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        height: 80,
                        width: "100%",
                        paddingTop: 36,
                        borderBottomWidth: 1,
                        borderColor: colors.darkcolor2
                    }}
                >

                            <View
                                style={{
                                    flex:1,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems:'center',
                                    height: '100%'                                    
                                }}
                            >
                                {this.displayBackButton()}
                                {this.displayLogo()}
                                {this.displayTitle()}
                            </View>

                            <View
                                style={{
                                    flex:1,
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems:'center',
                                    height: '100%'
                                }}
                            >
                                {this.displayJewelBox()}
                                {this.displayFactory()}
                            </View>

                </View>

                <View
                    style={{
                        height: 25,
                        width: "100%",
                        borderBottomWidth: 1,
                        borderColor: colors.darkcolor2,                        
                        flexDirection: "row"
                    }}
                >
                    

                    <View
                        style={{
                            height: 16,
                            width: 56,
                            backgroundColor: colors.lightcolor1,
                            marginTop: 4,
                            marginLeft: 8,
                            borderWidth:StyleSheet.hairlineWidth,
                            borderColor: '#00000000',
                            borderRadius:3,
                            overflow:'hidden',
                            justifyContent: 'center',
                            alignItems: 'center'
                            
                        }}                       
                    >
                        <ImageBackground source={require('../../assets/ColorGrad.jpg')} style={{width: '100%', height: '100%', justifyContent: 'center',
                            alignItems: 'center'}}>
                            <Text style={{fontSize:10, color:'white', }}>001</Text>  
                        </ImageBackground>                      
                    </View>

                    <View style={{height:'100%', flex:1, flexDirection: 'row', marginLeft:8 , marginRight:8 }}>

                        <View style={{height:'100%', width: '10%', padding:2 }}>
                            <XP height="100%" />
                        </View>
                        <View style={{height:'100%', width: '80%',flex:1, justifyContent:'center', alignItems:'center'}}>
                            
                            <View style={{ position:'absolute', width: '98%', height: 5, zIndex: 1,backgroundColor: colors.darkcolor3 ,borderColor:colors.darkcolor3, borderRadius:3, borderWidth: StyleSheet.hairlineWidth, overflow:'hidden'}}>
                                <View style={{width:'75%', height:'100%' }}>
                                    <ImageBackground source={require('../../assets/ColorGrad.jpg')} style={{width: '100%', height: '100%', justifyContent: 'center',
                                alignItems: 'center', overflow:'hidden'}}></ImageBackground>
                                </View>
                            </View>
                            <View style={{ position:'absolute', width: '100%', height: '100%', zIndex: 2, flex:1,justifyContent:'center', alignItems:'center' }}>
                                <Text style={{color:'white', fontWeight: '500', fontStyle:'italic', fontSize:16}}>444/1000</Text>
                            </View>
                        
                        </View>
                        <View style={{height:'100%', width: '10%', padding:2}}>
                            <XP height="100%"  />
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
          game: state.game
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