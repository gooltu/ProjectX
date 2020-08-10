import React from "react";

import { AppState, Text, Platform, PermissionsAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

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

import FriendProfile from './screens/App/FriendProfile/FriendProfile'
import UserProfile from './screens/App/Profile/UserProfile/UserProfile'
import ImageEdit from './screens/App/Profile/UserProfile/ImageEdit'

import ChatPage from "./screens/App/Chat/ChatPage/ChatPage";
import ForwardMessage from './screens/App/Chat/ForwardMessage/ForwardMessage'
import NewGroup from "./screens/App/NewGroup";
import JewelFactory from "./screens/App/JewelFactory";

import CustomHeader from "./shared_components/customHeader/CustomHeader";
import JCModal from "./shared_components/JCModal";

import colors from "./shared_styles/colors";
import TabIcon from "./svg_components/TabIcons";
import db from "../db/localdatabase";
import { realtimeConnect, realtimeDisconnect } from "../network/realtime"
import actions from '../actions'
import ContactsScreen from '../components/screens/App/Contacts/Contacts'


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
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    // ChatPage: {
    //     screen: ChatPage,
    //     navigationOptions: ({ navigation }) => {
    //         return {
    //             header: <CustomHeader navigation={navigation} />
    //         };
    //     }
    // },
    NewGroup: {
        screen: NewGroup,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    JewelFactory: {
        screen: JewelFactory,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    LeaderBoard: {
        screen: LeaderBoard,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    Wallet: {
        screen: Wallet,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    TaskDetail: {
        screen: TaskDetail,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    GiftTaskDetail: {
        screen: GiftTaskDetail,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
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
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    Contacts:{
        screen: ContactsScreen,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    UserProfile:{
        screen: UserProfile,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    ForwardMessage:{
        screen: ForwardMessage,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    },
    ImageEdit:{
        screen: ImageEdit,
        navigationOptions: ({ navigation }) => {
            return {
                header: <CustomHeader navigation={navigation} />
            };
        }
    }

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
    }
    componentWillUnmount() {
        console.log('UNMOUNT APP')
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.unsubscribe();
    }

     _handleAppStateChange = (nextAppState) => {

        console.log('APP STATE CHANGE',nextAppState);
        if(nextAppState == 'inactive' || nextAppState == 'background'){

            if(global.TimeDelta){

                try {
                    AsyncStorage.setItem(
                    'logOutTime',
                    (new Date().getTime() + global.TimeDelta).toString()
                    );
                } catch (error) {
                    // Error saving data
                }

            }    

            this.props.realtimeDisconnect();

        }
        
        this.props.appstateChange(nextAppState);

    };

    _handleNetworkChange = (state) => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        this.props.networkstateChange(state);

        if (!this.props.mytoken.isLoading && this.props.mytoken.token !== null && this.props.network.networkIsConnected)
            this.props.realtimeConnect();
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
        network: state.network
    }
}


function mapDispatchToProps(dispatch) {
    return {
        tokenLoad: (myTokens) => dispatch({ type: 'USER_TOKEN_LOADED', myTokens }),
        appstateChange: (appstate) => dispatch({ type: 'APP_STATE_CHANGE', payload: appstate }),
        networkstateChange: (network) => dispatch({ type: 'NETWORK_STATE_CHANGE', payload: network }),
        realtimeConnect: () => dispatch(realtimeConnect()),
        realtimeDisconnect: () => dispatch(realtimeDisconnect()),
        setChatListData: (chatList) => dispatch(actions.setChatListData(chatList)),
        setChatData: (chatData) => dispatch(actions.setChatData(chatData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(JewelChat);
