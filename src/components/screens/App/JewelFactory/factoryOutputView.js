import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator } from 'react-native'
import { renderJewel } from '../../../JCUtils/CommonUtils'
import styles from './jewelFactory.styles'
import colors from '../../../shared_styles/colors'
import JCImages from '../../../../assets/JCImages'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import NetworkManager from "../../../../network/NetworkManager";
import rest from '../../../../network/rest';
import actions from '../../../../actions';

class factoryOutputview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }
    checkJewelAvailability = (RequiredJewel) => {
        let jewel = this.props.game.jewels.filter((jewelType) => {
            return (RequiredJewel.jeweltype_id === jewelType.jeweltype_id)
        })
        if (jewel[0].count < RequiredJewel.count) {
            return true
        }
        else
            return false
    }
    startFactory = (factory) => {
        this.setState({
            isLoading: true
        })
        let factoryID = { factory_id: factory.factory_id }
        NetworkManager.callAPI(rest.startFactory, 'POST', factoryID).then(result => {
            this.props.getUserFactory()
            this.setState({
                isLoading: false
            })
        }).catch(error => {

        })
    }
    render() {
        return (
            <SafeAreaView style={{ marginHorizontal: 10, marginVertical: 5, height: 250, backgroundColor: colors.darkcolor3 }}>
                <View style={{ marginHorizontal: 5, alignItems: 'center', justifyContent: 'center', marginVertical: 5, height: 120, backgroundColor: colors.darkcolor1 }}>
                    {renderJewel(this.props.factory.jeweltype_id, 75, 75, styles.jewelStyle)}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'right', fontSize: 18, color: 'white', fontWeight: 'bold' }}>{this.props.material[2 * this.props.index].count}</Text>
                        <Text style={{ textAlign: 'right', fontSize: 18, color: 'white', fontWeight: 'bold' }}>{this.props.material[2 * this.props.index + 1].count}</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}> x </Text>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}> x </Text>
                    </View>
                    <View style={{ flexDirection: 'column', paddingRight: 20 }}>
                        {renderJewel(this.props.material[2 * this.props.index].jeweltype_id, 25, 25, styles.jewelStyle)}
                        {renderJewel(this.props.material[2 * this.props.index + 1].jeweltype_id, 25, 25, styles.jewelStyle)}
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        {this.checkJewelAvailability(this.props.material[2 * this.props.index]) ? <Icon name='close' color='red' size={20} /> : <Icon name='check' color='green' size={17} />}
                        {this.checkJewelAvailability(this.props.material[2 * this.props.index + 1]) ? <Icon name='close' color='red' size={20} /> : <Icon name='check' color='green' size={17} />}
                    </View>
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
                    onPress={() => this.startFactory(this.props.factory)}
                    disabled={!(this.checkJewelAvailability(this.props.material[2 * this.props.index]) && this.checkJewelAvailability(this.props.material[2 * this.props.index + 1])) || this.state.isLoading}
                >
                    <View style={{ width: 150, height: 40, zIndex: 1, backgroundColor: colors.darkcolor3, borderColor: colors.darkcolor3, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                        <View style={{ width: "100%", height: '100%' }}>
                            <ImageBackground source={JCImages.colorGrad} style={{
                                width: '100%', height: '100%', justifyContent: 'center',
                                alignItems: 'center', overflow: 'hidden'
                            }}></ImageBackground>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {this.state.isLoading ? <ActivityIndicator color={'white'} />
                            : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>START</Text>}
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
function mapStateToProps(state) {
    return {
        game: state.game,
        material: state.factory.materials,
        userFactory: state.userfactory.factoryuser
    };
}


function mapDispatchToProps(dispatch) {
    return {
        setTaskDetails: (payload) => (dispatch(actions.setTaskDetails(payload))),
        setTaskData: (payload) => dispatch(actions.setTaskData(payload)),
        loadGameState: () => dispatch(actions.loadGameState()),
        getUserFactory: () => dispatch(actions.getUserFactory())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(factoryOutputview)

