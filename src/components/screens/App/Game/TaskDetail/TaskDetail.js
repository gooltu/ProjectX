import React from 'react'
import {
    Image,
    ActivityIndicator,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import styles from './TaskDetail.styles'
import Coin from '../../../../svg_components/Coin';
import Logo from '../../../../svg_components/Logo';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../../shared_styles/colors'
import XP from '../../../../svg_components/XP';
import { FlatList } from 'react-native-gesture-handler';
import JCImages from '../../../../../assets/JCImages'



class TaskDetail extends React.Component {

    constructor(props) {
        super(props)
        this.task = this.props.navigation.state.params.task
    }
    jewelView(jewel) {
        let jewelView = []
        for (let i = 0; i < jewel.count; i++) {
            jewelView.push(
                <View style={{ paddingHorizontal: 3 }}>
                    <Logo height='25' width='25' />
                </View>
            )
        }
        return jewelView
    }
    CheckAvailablity(RequiredJewel){
    
        let jewel =  this.props.game.jewels.filter((jewelType)=>{
           return (RequiredJewel.jeweltype_id===jewelType.jeweltype_id)
         })
         console.log(RequiredJewel.count, jewel)
         if(jewel[0].count<RequiredJewel.count){
           return true
         }
         else
         return false
     
       }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 50 }}>
                    <View style={styles.scrollBarItem}>
                        <View style={styles.itemOne}>
                            <Coin height="30" width="30" />
                            <Text style={styles.itemText}>{this.task.coins}</Text>
                        </View>
                        <View style={styles.itemOne}>
                            <XP height="30" width="30" />
                            <Text style={styles.itemText}>{this.task.points}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
                <View>
                    <Text style={styles.CollectText}>COLLECT JEWELS</Text>
                </View>
                <View style={{ paddingBottom: 20, flexDirection:'column' }}>
                    {
                        this.props.taskdetails[this.task.task_id].map((jewel) =>
                            <View style={{ flexDirection: 'row',padding: 5 }}>
                                <View style={{ flexDirection: 'row', width:'85%',paddingLeft:'15%', alignItems:'center', justifyContent:'center' }}>
                                    {this.jewelView(jewel)}
                                </View>
                                <View style={{width:'15%'}}>
                                    {
                                         this.CheckAvailablity(jewel)?<Text>Less</Text>:<Text>Enough</Text>
                                    }
                                </View>
                            </View>
                        )
                    }

                </View>

                <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>


                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginTop:30 }}>
                    <View style={{ width: 220, height: 45, zIndex: 1, backgroundColor: color.darkcolor3, borderColor: color.darkcolor3, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' }}>
                        <View style={{ width: "100%", height: '100%' }}>
                            <ImageBackground source={JCImages.colorGrad} style={{
                                width: '100%', height: '100%', justifyContent: 'center',
                                alignItems: 'center', overflow: 'hidden'
                            }}></ImageBackground>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>WIN POINTS & COINS</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

}

function mapStateToProps(state) {
    return {
        tasks: state.tasks.tasks,
        taskdetails: state.taskdetails.taskdetails,
        gifttasks: state.gifttasks.gifttasks,
        gifttaskdetails: state.gifttaskdetails,
        usergifttasks: state.usergifttasks,
        game: state.game
    };
}


function mapDispatchToProps(dispatch) {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);