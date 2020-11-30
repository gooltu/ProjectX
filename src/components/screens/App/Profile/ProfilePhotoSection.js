import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    PixelRatio
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styles from './Profile.styles'
import JCImages from '../../../../assets/JCImages'
import { connect } from 'react-redux';
import Diamond from '../../../svg_components/Diamond'
import Coin from '../../../svg_components/Coin'
import rest from "../../../../network/rest";
import NetworkManager from "../../../../network/NetworkManager";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { InterstitialAd, RewardedAd, RewardedAdEventType, BannerAdSize, BannerAd, TestIds } from '@react-native-firebase/admob';
import { ActivityIndicator } from "react-native";

const rewardDiamond = RewardedAd.createForAdRequest(TestIds.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['Gaming', 'clothing']
});
const rewardCoin = RewardedAd.createForAdRequest(TestIds.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['Gaming', 'clothing']
});

class ProfilePhotoSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imagepath: '',
            diamondLoading: false,
            coinLoading: false,
            userProfile: {
                name: 'test'
            }
        }
    }
    componentDidMount() {
        let eventListener = rewardDiamond.onAdEvent((type, error, reward) => {
            if (type === RewardedAdEventType.LOADED) {
                console.log('loaded diamond')
                this.setState({
                    diamondLoading: false
                })
                rewardDiamond.show()
            }

            if (type === RewardedAdEventType.EARNED_REWARD) {
                console.log('User earned reward of diamond ', reward);
            }
        });
        let eventListenerCoin = rewardCoin.onAdEvent((type, error, reward) => {
            if (type === RewardedAdEventType.LOADED) {
                console.log('loaded coin')
                this.setState({
                    coinLoading: false
                })
                rewardCoin.show()
            }

            if (type === RewardedAdEventType.EARNED_REWARD) {
                console.log('User earned reward of coin', reward);
            }
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.loadProfilePicture()
        })
    }

    loadProfilePicture = () => {
        AsyncStorage.multiGet(["UserProfileImage", "UserProfile"]).then(profileData => {
            if (profileData[0][1] && profileData[1][1]) {
                this.setState({
                    imagepath: profileData[0][1],
                    userProfile: JSON.parse(profileData[1][1]),
                })
            }
            else {
                var data = {
                    'phone': this.props.mytoken.myphone
                }
                NetworkManager.callAPI(rest.downloadContact_Phone, 'post', data).then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.error == false) {
                        this.setState({
                            userProfile: responseJson.contact
                        })
                        AsyncStorage.setItem('UserProfileImage', responseJson.contact.large_pic)
                        AsyncStorage.setItem('UserProfile', JSON.stringify(responseJson.contact))
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        })
    }


    componentWillUnmount() {
        this.focusListener.remove()
    }


    showRewardeAd = (type) => {
        if (type == 'diamond') {
            this.setState({
                diamondLoading: true
            })
            rewardDiamond.load();
        }
        else if (type == 'coin') {
            this.setState({
                coinLoading: true
            })
            rewardCoin.load()
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ paddingTop: 40 }}>
                    <View style={styles.profileSection}>
                        <View style={styles.firstDiamond}>
                            {this.state.diamondLoading ?
                                <ActivityIndicator size={30}/>
                                :
                                <TouchableOpacity onPress={() => this.showRewardeAd('diamond')}>
                                    <Icon name={'add'} size={30} color={'white'} />
                                </TouchableOpacity>
                            }
                            <View style={styles.mainLeftLayout}>
                                <Diamond width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                                <Text style={{ color: 'white' }}>{this.props.game.jewels[0].count}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.profilePictureBorder} onPress={() => this.props.navigation.navigate('UserProfile')}>
                            <Image style={styles.ProfilePicture} key={this.state.imagepath} resizeMode="contain" source={{ uri: rest.imageBaseURL + this.props.mytoken.myphone + '.jpeg?time=' + new Date() }} />
                        </TouchableOpacity>
                        <View style={styles.SecondDiamond}>
                            <View style={styles.mainRightLayout}>
                                <Coin width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                                <Text style={{ color: 'white' }}>{this.props.game.jewels[1].count}</Text>
                            </View>
                            {this.state.coinLoading ?
                                <ActivityIndicator size={30}/>
                                :
                                <TouchableOpacity onPress={() => this.showRewardeAd('coin')} >
                                    <Icon name={'add'} size={30} color={'white'} />
                                </TouchableOpacity>}

                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                    <Text style={{ color: 'white' }}>{this.state.userProfile.name}</Text>
                </View>
            </SafeAreaView >
        );
    }
}

function mapStateToProps(state) {
    return {
        userachievements: state.userachievements.userachivements,
        achievements: state.achievements.achievements,
        game: state.game,
        mytoken: state.mytoken
    };
}


function mapDispatchToProps(dispatch) {
    return {
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhotoSection);
