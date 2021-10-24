import React from "react";

import { AppState, Text, Platform, PermissionsAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import Constants from '../network/rest';

import NetworkManager from '../network/NetworkManager';
import rest from '../network/rest';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-community/async-storage';

import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator
} from "react-navigation";

import { connect } from 'react-redux';

import JewelChatSplashScreen from "./screens/JewelChatSplashScreen";
import IntroScreen from "./screens/Auth/IntroScreen";
import RegisterPhone from "./screens/Auth/RegisterPhone";
import EnterOTP from "./screens/Auth/EnterOTP";
import EnterDetails from "./screens/Auth/EnterDetails";

import ChatList from "./screens/App/Chat/ChatList/ChatList";
import Game from "./screens/App/Game/Game";
import TaskDetail from "./screens/App/Game/TaskDetail/TaskDetail"
import GiftTaskDetail from "./screens/App/Game/GiftTaskDetail/GiftTaskDetail"
import SuccessFullGiftRedeem from './screens/App/Game/SuccessFullGiftRedeem'

import Profile from "./screens/App/Profile/Profile";
import LeaderBoard from './screens/App/Profile/LeaderBoard/LeaderBoard'
import Wallet from './screens/App/Profile/Wallet/WalletScreen'
import ShareScreen from './screens/App/Profile/Share/ShareScreen'

import FriendProfile from './screens/App/FriendProfile/FriendProfile'
import UserProfile from './screens/App/Profile/UserProfile/UserProfile'
import ImageEdit from './screens/App/Profile/UserProfile/ImageEdit'
import GiftsWon from './screens/App/Profile/UserProfile/GiftsWon'

import ChatPage from "./screens/App/Chat/ChatPage/ChatPage";
import ChatMediaViewer from "./screens/App/Chat/ChatMediaViewer/ChatMediaViewer";
import ChatRoomDetails from './screens/App/Chat/ChatRoomDetails/ChatRoomDetails';
import ForwardMessage from './screens/App/Chat/ForwardMessage/ForwardMessage';
import NewGroup from "./screens/App/NewGroup";
import JewelFactory from "./screens/App/JewelFactory/jewelFactory";

import CustomHeader from "./shared_components/customHeader/CustomHeader";
import HeaderLevelZero from "./shared_components/customHeader/HeaderLevelZero";
import HeaderLevelOnePlus from "./shared_components/customHeader/HeaderLevelOnePlus";
import HeaderChatPage from "./shared_components/customHeader/HeaderChatPage";
import JCModal from "./shared_components/JCModal";

import AdminStuff from "./screens/App/AdminStuff/AdminStuff";

import colors from "./shared_styles/colors";
import TabIcon from "./svg_components/TabIcons";
import db from "../db/localdatabase";

import { realtimeConnect, realtimeDisconnect } from "../network/realtime"
import { downloadMessages } from "../network/realtime-utils/download-history"

import actions from '../actions'
import ContactsScreen from '../components/screens/App/Contacts/Contacts'

import CreateGroupScreen from '../components/screens/App/CreateGroup/CreateGroupScreen'
import NewGroupScreen from '../components/screens/App/CreateGroup/NewGroupScreen'

const MainTabs = createBottomTabNavigator({

    Chats: {
        screen: ChatList,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabIcon
                    name="Chats"
                    fill={tintColor}
                    height="25"
                    width="25"
                />
            )
        })
    },
    Game: {
        screen: Game,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabIcon
                    name="Gifts"
                    fill={tintColor}
                    height="25"
                    width="25"
                />
            )
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabIcon
                    name="Profile"
                    fill={tintColor}
                    height="25"
                    width="25"
                />
            )
        })
    }

}, {
    initialRouteName: 'Chats',
    backBehavior: 'none',
    lazy: true,
    tabBarOptions: {
        activeTintColor: colors.lightcolor1,
        activeBackgroundColor: colors.darkcolor3,
        inactiveTintColor: colors.jcgray,
        inactiveBackgroundColor: colors.darkcolor3,
        style: {
            backgroundColor: colors.darkcolor3
        }
    }
});
//const AppStack = createStackNavigator({ Profile
//   /*  MainTabs, Chats, Contacts, ContactDetails, JewelFactories, Wallet, LeaderBoard, Settings, SharedWith, Settings */  });

const AppMainStack = createStackNavigator({
    MainTabs: {
        screen: MainTabs,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelZero navigation={navigation} title='JewelChat' />
            };
        }
    },
    ChatPage: {
        screen: ChatPage,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderChatPage navigation={navigation} title='Chat Page' />
            };
        }
    },
    ChatMediaViewer: {
        screen: ChatMediaViewer,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Media' />
            };
        }
    },
    ChatRoomDetails: {
        screen: ChatRoomDetails,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Media' />
            };
        }
    },
    NewGroup: {
        screen: NewGroup,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Create New Group' />
            };
        }
    },
    JewelFactory: {
        screen: JewelFactory,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Jewel Factory' />
            };
        }
    },
    LeaderBoard: {
        screen: LeaderBoard,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Leaderboard' />
            };
        }
    },
    Wallet: {
        screen: Wallet,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Wallet' />
            };
        }
    },
    TaskDetail: {
        screen: TaskDetail,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Task Detail' />
            };
        }
    },
    GiftTaskDetail: {
        screen: GiftTaskDetail,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Gift Task Detail' />
            };
        }
    },
    SuccessFullGiftRedeem: {
        screen: SuccessFullGiftRedeem,
        navigationOptions: ({ navigation }) => {
            return {
                header: null
            };
        }
    },
    FriendProfile: {
        screen: FriendProfile,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='' />
            };
        }
    },
    Contacts: {
        screen: ContactsScreen,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Contacts' />
            };
        }
    },
    UserProfile: {
        screen: UserProfile,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Profile' />
            };
        }
    },
    ForwardMessage: {
        screen: ForwardMessage,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Forward..' />
            };
        }
    },
    ImageEdit: {
        screen: ImageEdit,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Change Picture' />
            };
        }
    },
    GiftsWon: {
        screen: GiftsWon,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Gifts Won' />
            };
        }
    },
    ShareScreen: {
        screen: ShareScreen,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Referrals' />
            };
        }
    },
    CreateGroupScreen: {
        screen: CreateGroupScreen,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='New Group' />
            };
        }
    },
    NewGroupScreen: {
        screen: NewGroupScreen,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='New Group' />
            };
        }
    },
    AdminStuff: {
        screen: AdminStuff,
        navigationOptions: ({ navigation }) => {
            return {
                header: <HeaderLevelOnePlus navigation={navigation} title='Admin Stuff' />
            };
        }
    },


}, {
    headerMode: 'screen'
});



const AppStack = createStackNavigator(
    {
        Main: {
            screen: AppMainStack,
        },
        MyModal: {
            screen: JCModal,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
        transparentCard: true,
        defaultNavigationOptions: {
            gesturesEnabled: false
        },
        cardStyle: {
            // makes transparentCard work for android
            opacity: 1.0
        },
    }
);



const AuthStack = createStackNavigator(
    { IntroScreen, RegisterPhone, EnterOTP, EnterDetails },
    { headerMode: "none" }
);

//export default createAppContainer(

let AppContainer = createAppContainer(

    createSwitchNavigator(
        {
            AuthLoading: JewelChatSplashScreen,
            App: AppStack,
            Auth: AuthStack
        },
        {
            initialRouteName: "AuthLoading"
        }
    )
);



class JewelChat extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        console.log('CURRENT STATE', this.props);
        //console.log(this.props)
    }



    componentDidMount() {
        console.log('MOUNT APP');
        AppState.addEventListener('change', this._handleAppStateChange);
        this.unsubscribe = NetInfo.addEventListener(this._handleNetworkChange);       


        db.getChatList().then(chatList => {
            console.log('FROM JEWELCHAT COMPONENT GETCHAT SUCCESS');
            console.log(chatList);
            this.props.setChatListData(chatList);
        })
        .catch(err => {
            console.log('FROM JEWELCHAT COMPONENT GETCHAT ERROR')
            console.log(err)
        })

        //  if (!this.props.mytoken.isLoading && this.props.mytoken.token !== null && this.props.network.networkIsConnected){
        //     console.log('Came to real time connect')
        //     this.props.realtimeConnect();
        //     }

        messaging().onTokenRefresh(async (fcmToken) => {
            
            let data = {
							token: fcmToken,
							push_service: Platform.OS === 'ios' ? 'ios' : 'android'
						}      
        
						NetworkManager.callAPI(rest.updatePushNotificationToken, 'POST', data).then((responseJson) => {
										this.props.tokenLoad({tokenrefresh: true, fcmToken })
						})
						.catch((error) => {});

        });
        
        
    }
    componentWillUnmount() {
        console.log('UNMOUNT APP')
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.unsubscribe();
    }

    _handleAppStateChange = (nextAppState) => {

        console.log('APP STATE CHANGE', nextAppState);
        this.props.appstateChange(nextAppState);
        if (nextAppState == 'inactive' || nextAppState == 'background') {

            console.log('LOGOUT TIME/ DOWNLOAD COMPLETE', global.dowloadMessagesComplete, global.TimeDelta);

            if (global.TimeDelta && global.dowloadMessagesComplete) {

                try {
                    AsyncStorage.setItem(
                        'logOutTime',
                        (new Date().getTime() + global.TimeDelta).toString()  //'1609707334068'
                    ).then(val => {
                        console.log('LOGOUT TIME SAVED');	
                    });
                } catch (error) {
                    // Error saving data
                }

            }
            
            //this.props.setActiveChat({})
            //this.props.closeRealtimeDisconnect();

        }else if(nextAppState == 'active')  {

            axios.post(Constants.baseURL + Constants.getAccessToken,
                { "refreshToken": this.props.mytoken.token }
            ).then(response => { 
                console.log('JEWELCHAT access token load successful return from background/inactive')   
                let temptokens = this.props.mytoken;
                temptokens.cookie = response.data.accessToken;     
                this.props.tokenLoad(temptokens);    
            }).catch(error => {
                //handle logout flow
                console.log(error)
            });

            global.dowloadMessagesComplete = false;

            global.randstr = 'time=' + new Date().getTime();
            console.log('RANDSTR ', global.randstr);

						if(this.props.network.xmppState === 'XMPP_CONNECTED'){

								AsyncStorage.getItem('logOutTime')
								.then( (lastlogouttime) => {	
									console.log('LOGOUT TIME', lastlogouttime);	
									
									if( lastlogouttime ){		
											
										let current_servertime = new Date().getTime() + global.TimeDelta
										lastlogouttime = current_servertime - parseInt(lastlogouttime) > 604800000 ? (current_servertime - 604800000) : ( parseInt(lastlogouttime) - 1200000 );
										this.props.downloadMessages(lastlogouttime);

									}else
                                        global.dowloadMessagesComplete = true;

								});

						}

        }  

    };

    _handleNetworkChange = (state) => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        this.props.networkstateChange(state);

        if (!this.props.mytoken.isLoading && this.props.mytoken.token !== null && this.props.network.networkIsConnected)
            this.props.openRealtimeConnect();
    }


    render() {
        return (

            <AppContainer />

        );
    }

}


function mapStateToProps(state) {
    return {
        mytoken: state.mytoken,
        appstate: state.appstate,
        network: state.network,
        // activeChat: state.activechat,
        // chatslist: state.chatslist,
        // tasks: state.tasks,
        // taskdetails: state.taskdetails,
        // gifttasks: state.gifttasks,
        // gifttaskdetails: state.gifttaskdetails,
        // usergifttasks: state.usergifttasks,
        game: state.game,
        // presence: state.presence
    }
}


function mapDispatchToProps(dispatch) {
    return {
        tokenLoad: (myTokens) => dispatch({ type: 'USER_TOKEN_LOADED', myTokens }),
        appstateChange: (appstate) => dispatch({ type: 'APP_STATE_CHANGE', payload: appstate }),
        networkstateChange: (network) => dispatch({ type: 'NETWORK_STATE_CHANGE', payload: network }),
        openRealtimeConnect: () => dispatch(realtimeConnect()),
        //closeRealtimeDisconnect: () => dispatch(realtimeDisconnect()),
        setChatListData: (chatList) => dispatch(actions.setChatListData(chatList)),
        setChatData: (chatData) => dispatch(actions.setChatData(chatData)),
        setActiveChat: (activeChat) => dispatch(actions.setActiveChat(activeChat)),
        downloadMessages: (lastlogouttime) => dispatch(downloadMessages(lastlogouttime))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(JewelChat);
