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

import CustomHeader from "../../../../shared_components/customHeader/CustomHeader";
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
import fs from 'react-native-fs'
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
            userProfile: {}
        }
        this.getProfileData()

    }
    componentDidMount() {

        console.log('AWS', AWS)
    }
    getAWSTaken(image, pic) {
        NetworkManager.callAPI(rest.awsToken, 'get', null).then((responseJson) => {
            console.log('AWS token result')
            this.uploadImagetoAWS(image, pic, responseJson)
            console.log(responseJson)
        }).catch((error) => {
            console.log(error)
        })
    }
    getProfileData() {
        var data = {
            'phone': '918756463536'
        }
        AsyncStorage.getItem('UserProfile').then(profileData => {
            console.log(profileData)
            if (false) {
                var profile = JSON.parse(profileData)
                console.log(JSON.parse(profile))
                this.setState({
                    userProfile: profile
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
    uploadImagetoAWS = (image, pic, responseJson) => {
        AWS.config.region = 'ap-south-1'
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'ap-south-1:c595f34e-88f7-4bc7-9fd5-fe8881952dc1',
            IdentityId: responseJson.IdentityId,
            Logins: {
                'cognito-identity.amazonaws.com': responseJson.Token
            }
        });
        console.log(AWS.config.credentials)
        var s3 = new AWS.S3({
            apiVersion: '2014-06-30',
            params: { Bucket: 'parthaprofiles' }
        });

        //Refresh and Upload
        AWS.config.credentials.refresh(() => {
            var keyName = '918756463536.jpeg';
            let contentType = image.mime;
            const arrayBuffer = decode(image.data);
            var params = { Bucket: 'parthaprofiles', Key: keyName, Body: arrayBuffer, contentType: contentType };
            var upload = new AWS.S3.ManagedUpload({
                params: params
            });
            upload.send((err, data) => {
                console.log(err, data);
                this.updateInServer(data.Location, pic)
                this.setState({
                    imagepath: data.Location
                })
            });
        });
    }

    updateInServer = (largePic, pic) => {
        console.log(largePic, pic)
    }
    openImagePicker() {
        ImagePicker.openPicker({
            cropping: true,
            width: 500,
            height: 500,
            includeBase64: true,
            compressImageQuality: 0.5
        }).then(image => {
            console.log(image);
            this.setState({
                imagepath: image.path
            })
            //  this.crop(image.path, image)
        })
    }
    crop(imagePath, image) {
        var cropData = {
            offset: { x: 0, y: 0 },
            size: { width: 500, height: 500 },
            displaySize: { width: 40, height: 40 },
            resizeMode: 'contain'
        };
        ImageEditor.cropImage(imagePath, cropData).then(url => {
            console.log("Cropped image uri", url);

            RNFS.readFile(url, 'base64').then(base64image => {
                console.log('cropped base64', base64image)

                var image64 = `data:${image.mime};base64,${base64image}`
                console.log(image64)
                // this.state.userProfile['pic'] = JSON.stringify(url)
                // this.state.userProfile['large_pic'] = JSON.stringify(imagePath)
                // console.log(this.state.userProfile)
                // this.setState({
                //     userProfile: this.state.userProfile
                // })
                //  this.getAWSTaken(image, image64)
                AsyncStorage.setItem('UserProfile', JSON.stringify(this.state.userProfile))
            })
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
        }).catch((error) => {
            console.log(error)
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
        }).catch((error) => {
            console.log(error)
        })
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>

                <TouchableOpacity style={{ paddingTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center' }} key={this.state.imagepath} source={this.state.imagepath ? { uri: this.state.imagepath } : JCImages.placeholderImage} />
                    <TouchableOpacity style={{ marginLeft: 100, top: -30, width: 40, height: 40, backgroundColor: colors.darkcolor1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                        <Icon name='edit' size={25} color='white' />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize:16, top:-30 }} onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', value: this.state.userProfile.name, UpdateStatus: this.updateName })}>{this.state.userProfile.name}</Text>
                    <Text style={{ color: 'white', fontSize:16, top:-30 }}>+{this.state.userProfile.phone}</Text>
                </TouchableOpacity>
                <List>
                    <ListItem>
                        <Body>
                            <Text style={{ color: 'white' }}>STATUS</Text>
                            <Text style={{ color: 'white' }} note onPress={() => this.props.navigation.navigate('MyModal', { modal_name: 'UpdateStatus', value: this.state.userProfile.status, UpdateStatus: this.updateStatus })}>{this.state.userProfile.status}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity>
                                <Icon name='edit' size={25} color='white' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                </List>
                
                <Button onPress={() => this.openImagePicker()} title='Select Image' />
            </SafeAreaView >
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}


function mapDispatchToProps(dispatch) {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

//+ '?' + new Date()