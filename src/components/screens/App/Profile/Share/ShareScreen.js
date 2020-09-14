import React from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import styles from '../LeaderBoard/LeaderBoard.styles'

import { connect } from 'react-redux';
import LeaderBoardRow from "../LeaderBoard/LeaderBoardRow";
import colors from "../../../../shared_styles/colors";
import { renderJewel } from "../../../../JCUtils/CommonUtils";

class ShareScreen extends React.Component {
    constructor(props) {
        super(props)
        this.children = this.props.navigation.getParam('children')
        console.log(this.children)
    }

    componentDidMount() {
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {Object.keys(this.children).length > 0 ?
                    <ScrollView style={{ padding: 10 }}>
                        {this.children.map(item =>
                            <LeaderBoardRow type={'other'} item={item} />
                        )}
                    </ScrollView> :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: '400', color: colors.jcgray }}>Not referred any one yet.</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Contacts')
                        }} style={{ flexDirection: 'row', padding: 10, marginTop: 10, borderRadius: 5, backgroundColor: colors.lightcolor2 }}>
                            <Text style={{ fontSize: 20, fontWeight: '500', color: 'white', justifyContent: 'center' }}>Refer and win </Text>
                            {renderJewel(0, 25, 25, styles.jewelStyle)}
                        </TouchableOpacity>
                    </View>
                }

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


export default connect(mapStateToProps, mapDispatchToProps)(ShareScreen);
