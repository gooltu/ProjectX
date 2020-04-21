import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator,
    Text,
    Button,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import colors from "../../shared_styles/colors";
import { connect } from 'react-redux';



class JewelStore extends React.Component {

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end'
                }}
            >

                <TouchableOpacity style={{
                    flex: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '35%',
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
                    height: '65%',
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
                        <Text>Jewel Store</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>




                    </View>

                </View>
            </View>
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


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(JewelStore);


