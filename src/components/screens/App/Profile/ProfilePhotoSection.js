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

class ProfilePhotoSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imagepath: '',
            userProfile: {
                name: 'test'
            }
        }
    }
    componentDidMount() {
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


   
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ paddingTop: 40 }}>
                    <View style={styles.profileSection}>
                        <View style={styles.firstDiamond}>
                            <View style={styles.mainLeftLayout}>
                                <Diamond width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                                <Text style={{ color: 'white' }}>{this.props.game.jewels[0].count}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')}>
                            <Image style={styles.ProfilePicture} key={this.state.imagepath} resizeMode="contain" source={this.state.imagepath ? { uri: this.state.imagepath } : JCImages.placeholderImage} />
                        </TouchableOpacity>
                        <View style={styles.SecondDiamond}>
                            <View style={styles.mainRightLayout}>
                                <Coin width={PixelRatio.roundToNearestPixel(35 * global.scaleFactor)} height={PixelRatio.roundToNearestPixel(30 * global.scaleFactor)} />
                                <Text style={{ color: 'white' }}>{this.props.game.jewels[1].count}</Text>
                            </View>
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
    console.log('state.achievements.achievements', state.userachievements.userachivements)
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
