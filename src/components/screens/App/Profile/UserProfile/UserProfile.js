import React from "react";
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    SafeAreaView,
    View,
    Button,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ImageBackground,
    PixelRatio,
    Modal
} from "react-native";
import styles from './UserProfile.styles'
import JCImages from '../../../../../assets/JCImages'
import { connect } from 'react-redux';
import Logo from '../../../../svg_components/Logo';
import Diamond from '../../../../svg_components/Diamond'
import ImagePicker from 'react-native-image-crop-picker';
import ImageEditor from "@react-native-community/image-editor";
import RNFS from 'react-native-fs'
import NetworkManager from "../../../../../network/NetworkManager";
import rest from "../../../../../network/rest";
import AsyncStorage from "@react-native-community/async-storage";
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { decode } from "base64-arraybuffer";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../../../shared_styles/colors";
import { List, ListItem, Left, Body, Right } from 'native-base';


class UserProfile extends React.Component {
    /*static navigationOptions = ({ navigation }) => {
      
      console.log('HERE');
      return {
        header: <CustomHeader levelbar="show" />
      };
  };*/
    constructor(props) {
        super(props)
        this.state = {
            imagepath: '',
            imageUri: '',
            userProfile: { name: '' }
        }
        this.getProfileData()
    }
    componentDidMount() {
    }
    getProfileData() {
        var data = {
            'phone': this.props.mytoken.myphone
        }
        AsyncStorage.multiGet(["UserProfileImage", "UserProfile"]).then(profileData => {
            console.log(profileData)
            if (profileData[0][1]) {
                this.setState({
                    imagepath: profileData[0][1],
                    userProfile: JSON.parse(profileData[1][1])
                })
            }
            else {
                NetworkManager.callAPI(rest.downloadContact_Phone, 'post', data).then((responseJson) => {
                    if (responseJson.error == false) {
                        this.setState({
                            userProfile: responseJson.contact
                        })
                        AsyncStorage.setItem('UserProfile', JSON.stringify(responseJson.contact))
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        })

    }

    updateStatus = (status) => {
        console.log(status)
        this.state.userProfile['status'] = status
        this.setState({
            userProfile: this.state.userProfile
        })
        var data = {
            "status": status
        }
        NetworkManager.callAPI(rest.updateStatus, 'post', data).then((responseJson) => {
            AsyncStorage.setItem('UserProfile', JSON.stringify(this.state.userProfile))
        }).catch((error) => {
            console.log(error)
        })
    }
    updateName = (name) => {
        this.state.userProfile['name'] = name
        this.setState({
            userProfile: this.state.userProfile
        })
        var data = {
            "name": name
        }
        NetworkManager.callAPI(rest.updateProfileName, 'post', data).then((responseJson) => {
            AsyncStorage.setItem('UserProfile', JSON.stringify(this.state.userProfile))
        }).catch((error) => {
            console.log(error)
        })
    }
    updateUpi = (upi) => {
        console.log(upi)
    }
    updateDob = (dob) => {
        console.log(dob)
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>

                <TouchableOpacity style={{ paddingTop: 30, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('ImageEdit')}>
                    <Image style={{ width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center' }} key={this.state.imagepath} source={this.state.imagepath ? { uri: this.state.imagepath } : JCImages.placeholderImage} />
                    <TouchableOpacity style={{ marginLeft: 100, top: -30, width: 40, height: 40, backgroundColor: colors.darkcolor1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }} onPress={() => this.props.navigation.navigate('ImageEdit')}>
                        <Icon name='edit' size={22} color='white' />
                    </TouchableOpacity>
                    {/* <Text style={{ color: 'white', fontSize: 16, top: -30 }} onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', value: this.state.userProfile.name, UpdateStatus: this.updateName })}>{this.state.userProfile.name}</Text> */}
                    <Text style={{ color: 'white', fontSize: 16, top: -30 }}>+{this.state.userProfile.phone}</Text>
                </TouchableOpacity>
                <List>
                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>NAME</Text>
                            <Text style={{ color: 'white' }} note onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE NAME', value: this.state.userProfile.name, UpdateStatus: this.updateName })}>{this.state.userProfile.name}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE NAME', value: this.state.userProfile.name, UpdateStatus: this.updateName })}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>STATUS</Text>
                            <Text style={{ color: 'white' }} note onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE STATUS', value: this.state.userProfile.status, UpdateStatus: this.updateStatus })}>{this.state.userProfile.status}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE STATUS', value: this.state.userProfile.status, UpdateStatus: this.updateStatus })}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>

                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>UPI Address</Text>
                            <Text style={{ color: 'white' }} note onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE UPI', value: this.state.userProfile.status, UpdateStatus: this.updateUpi })}>hradcodedValue@okhdfcbank</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE UPI', value: this.state.userProfile.status, UpdateStatus: this.updateUpi })}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>Date of Birth</Text>
                            <Text style={{ color: 'white' }} note onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE DOB', value: this.state.userProfile.status, UpdateStatus: this.updateDob })}>20-04-1995</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', subType: 'UPDATE DOB', value: this.state.userProfile.status, UpdateStatus: this.updateDob })}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>Gender</Text>
                            <Text style={{ color: 'white' }} note>Male</Text>
                        </Body>
                        {/* <Right>
                            <TouchableOpacity onPress={() => console.log('DOB')}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right> */}
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>Shipping Address</Text>
                            <Text style={{ color: 'white' }} note>test Address</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => console.log('Address')}>
                                <Icon name='edit' size={20} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                </List>

                {/* <Button onPress={() => this.openImagePicker()} title='Select Image' /> */}
            </SafeAreaView >
        );
    }
}

function mapStateToProps(state) {
    return {
        mytoken: state.mytoken
    };
}


function mapDispatchToProps(dispatch) {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

//+ '?' + new Date()