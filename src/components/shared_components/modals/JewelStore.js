import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    Text,
    Button,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';

import colors from "../../shared_styles/colors";
import { connect } from 'react-redux';
import { renderJewel } from '../../JCUtils/CommonUtils'
import styles from './Modal.styles'
import JCImages from '../../../assets/JCImages';
import actions from '../../../actions';
import { InterstitialAd, RewardedAd, RewardedAdEventType, BannerAdSize, BannerAd, TestIds } from '@react-native-firebase/admob';

// const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
//     requestNonPersonalizedAdsOnly: true,
//     keywords: ['fashion', 'clothing'],
// });

class JewelStore extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // rewarded.load();
        // let eventListener = rewarded.onAdEvent((type, error, reward) => {
        //     if (type === RewardedAdEventType.LOADED) {
        //        console.log('loaded')
        //     }

        //     if (type === RewardedAdEventType.EARNED_REWARD) {
        //         console.log('User earned reward of ', reward);
        //     }
        // });
        console.log('test mount')
      //  if (!(Object.keys(this.props.game.scores).length > 0))
            this.props.loadGameState()
    }

    jewelCount() {
        let jewelCount = 0
        for (let i = 3; i < this.props.game.jewels.length; i++) {
            jewelCount = jewelCount + this.props.game.jewels[i].count
        }
        return jewelCount
    }
    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'flex-end'
                }}
            >

                <TouchableOpacity style={{
                    flex: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '25%',
                    backgroundColor: colors.darkcolor1,
                    opacity: 0.5
                }}
                    onPress={() => { console.log('Herex'); this.props.modalprops.navigation.goBack() }}
                >
                </TouchableOpacity>

                <View style={{
                    flex: 0,
                    //justifyContent: 'center',
                    alignItems: 'center',
                    height: '75%',
                    backgroundColor: colors.darkcolor2,
                    borderTopWidth: 1,
                    borderTopColor: 'white'
                }}
                >
                    <View style={{
                        position: 'absolute',
                        top: -40,
                        height: 80,
                        width: 80,
                        backgroundColor: colors.darkcolor1,
                        borderColor: 'white',
                        borderWidth: 4,
                        borderRadius: 40,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10
                    }}
                    >
                        <ImageBackground source={require('../../../assets/jewelbox.png')} style={{ width: '100%', height: '100%' }} resizeMode='center' />
                    </View>
                    <View style={{ marginTop: 60, marginBottom: 10, width: '100%', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, fontWeight: '400', color: 'white', paddingRight: 10 }}>0</Text>
                            <View style={{ width: '75%', height: 8, zIndex: 1, backgroundColor: colors.darkcolor3, borderColor: colors.darkcolor3, borderRadius: 3, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                                <View style={{ width: "" + this.jewelCount() * 100 / 25 + "%", height: '100%' }}>
                                    <ImageBackground source={JCImages.colorGrad} style={{
                                        width: '100%', height: '100%', justifyContent: 'center',
                                        alignItems: 'center', overflow: 'hidden'
                                    }}></ImageBackground>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '400', color: 'white', paddingLeft: 10 }}>25</Text>
                        </View>
                        <View style={{ height: 50, paddingTop: 20 }}>
                            {this.jewelCount() == 25 ?
                                <Text style={{ fontSize: 16, fontWeight: '400', color: 'white' }}>Jewel Store is FULL.</Text> : null}
                        </View>
                        <FlatList style={{ margin: 5, width: '100%' }}
                            numColumns={3}
                            scrollEnabled={false}               // set number of columns 
                            columnWrapperStyle={{ flex: 1 }}  // space them out evenly
                            data={this.props.game.jewels.length > 0 ? this.props.game.jewels.slice(3) : this.props.game.jewels}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item }) =>
                                <View style={{ paddingTop: 20, flexDirection: 'row', width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                                    <View>
                                        {renderJewel(item.jeweltype_id, 35, 35, styles.jewelStyle)}
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: 'white' }}>{item.count < 9 ? '0' + item.count : item.count}</Text>
                                </View>
                            }
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ padding: 20, height: 100 }}>
                            {/* <BannerAd
                                unitId={TestIds.BANNER}
                                size={BannerAdSize.SMART_BANNER}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true,
                                }} /> */}
                        </View>
                    </View>
                    <Button
                        title="Show Rewarded Ad"
                        onPress={() => {
                            rewarded.show();
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

}


function mapStateToProps(state) {
    return {
        game: state.game
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadGameState: () => dispatch(actions.loadGameState())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(JewelStore);


