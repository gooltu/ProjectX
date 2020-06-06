import React from "react"
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
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
import ImagePicker from 'react-native-image-crop-picker';
import ImageEditor from "@react-native-community/image-editor";
import RNFS from 'react-native-fs'
import NetworkManager from "../../../../../network/NetworkManager";
import rest from "../../../../../network/rest";
import AsyncStorage from "@react-native-community/async-storage";
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { decode } from "base64-arraybuffer";
import colors from "../../../../shared_styles/colors";
import { Button } from 'native-base';

class ImageEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imagepath: ''
        }
    }
    componentDidMount() {
        console.log('AWS', AWS)
        AsyncStorage.multiGet(["UserProfileImage", "UserProfile"]).then(profileData => {
            console.log(profileData)
            if (profileData) {
                this.setState({
                    imagepath: profileData[0][1]
                })
            }
        })
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
    uploadImagetoAWS = (image, pic, responseJson) => {
        AWS.config.region = 'ap-south-1'
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'ap-south-1:c595f34e-88f7-4bc7-9fd5-fe8881952dc1',
            IdentityId: responseJson.IdentityId,
            Logins: {
                'cognito-identity.amazonaws.com': responseJson.Token
            }
        });
        // Refresh and Upload
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
        let data ={
            "picbase64": pic,
            "pic_url": largePic
        }
        NetworkManager.callAPI(rest.updateProfilepic, 'POST', data).then((responseJson) => {
            console.log(responseJson)
        }).catch((error) => {
            console.log(error)
        })
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
            // this.setState({
            //     imagepath: image.path
            // })
            this.crop(image.path, image)
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
                this.getAWSTaken(image, image64)
                AsyncStorage.setItem('UserProfileImage', `data:${image.mime};base64,${image.data}`)
            })
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkcolor1 }}>
                <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 400, height: 400, alignItems: 'center', justifyContent: 'center' }} key={this.state.imagepath} source={this.state.imagepath ? { uri: this.state.imagepath } : JCImages.placeholderImage} />
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                    <Button style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} primary><Text style={{ color: 'white' }}>CLEAR</Text></Button>
                    <Button style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.openImagePicker()} primary><Text style={{ color: 'white' }}>UPLOAD</Text></Button>
                </View>
            </SafeAreaView>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageEdit);
