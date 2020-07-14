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
import { List, ListItem, Left, Body, Right } from 'native-base';

class GiftsWon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            giftsWon: [
                {
                    "id": 3,
                    "user_id": 2,
                    "productname": "Shirt",
                    "product_pic": "",
                    "gifttaskuser_id": 14,
                    "money": 0,
                    "money_channel": null,
                    "status": "Will be ordered in 12hrs",
                    "notes": null,
                    "updated_at": "0000-00-00 00:00:00",
                    "field1": ""
                },
                {
                    "id": 3,
                    "user_id": 2,
                    "productname": "Shirt",
                    "product_pic": "",
                    "gifttaskuser_id": 14,
                    "money": 100,
                    "money_channel": 'PhonePe',
                    "status": "Successfully Transferred",
                    "notes": null,
                    "updated_at": "0000-00-00 00:00:00",
                    "field1": ""
                }
            ]
        }
    }
    componentDidMount() {
        NetworkManager.callAPI(rest.getAllGiftsWon, 'GET', null).then(result => {
            this.setState({
                //   giftsWon: result.gifts
            })
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkcolor1 }}>
                <View style={{ padding: 10 }}>
                    {this.state.giftsWon.map(item =>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'grey', borderRadius: 10, borderWidth: 1, padding: 5, marginBottom: 10 }}>
                            {item.money > 0 ?
                                <View style={{borderRadius:5, width: 60, height: 60,justifyContent:'center',alignItems:'center',backgroundColor:colors.lightBlue }}>
                                    <Text style={{color:'white'}}>{'\u20B9'} {item.money}</Text>
                                </View>
                                :
                                <Image style={{ width: 60, height: 60,borderRadius:5 }} source={item.product_pic != '' ? { uri: item.product_pic } : JCImages.placeholderImage}></Image>
                            }
                            <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                <Text style={{ color: 'lightgrey', fontSize: 16, paddingBottom: 5 }}>{item.money > 0 ? item.money_channel : item.productname}</Text>
                                <Text style={{ color: 'white' }}><Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>STATUS:</Text> {item.status}</Text>
                            </View>
                        </View>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(GiftsWon);
