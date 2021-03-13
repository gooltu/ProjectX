import React from 'react';
import { Text, View, Image } from 'react-native';
import JCImages from '../../../../../assets/JCImages'
import styles from './LeaderBoard.styles'
import { renderJewel } from '../../../../JCUtils/CommonUtils'
import colors from "../../../../shared_styles/colors";
import XP from '../../../../svg_components/XP';
import rest from '../../../../../network/rest';


const LeaderBoardRow = (props) => {
    const item = props.item
    return (
        <View style={{ backgroundColor: props.type == 'user' ? colors.lightBlue : null, flexDirection: 'row', alignItems: 'center', borderColor: props.type == 'user' ? colors.lightBlue : 'grey', borderRadius: 10, borderWidth: 1, padding: 5, marginBottom: 10 }}>
            <Image style={{ width: 45, height: 45, borderRadius: 22 }} source={{ uri: rest.imageBaseURL+ item.phone + '.jpeg?time=' + new Date() }}></Image>
            <View style={{ flexDirection: 'column', paddingLeft: 10, width: '70%' }}>
                <Text style={{ color: 'lightgrey', fontSize: 16, paddingBottom: 5 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: colors.lightcolor1, fontWeight: 'bold' }}>LEVEL:</Text>
                        <Text style={{ color: 'white' }}> {item.level}</Text>
                    </View>                    
                </View>
            </View>
        </View>
    );
}

export default LeaderBoardRow;
