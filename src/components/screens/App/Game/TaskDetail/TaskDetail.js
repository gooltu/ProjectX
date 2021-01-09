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
    Platform,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Alert
} from 'react-native';
import styles from './TaskDetail.styles'
import Coin from '../../../../svg_components/Coin';
import Logo from '../../../../svg_components/Logo';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import color from '../../../../shared_styles/colors'
import XP from '../../../../svg_components/XP';
import JCImages from '../../../../../assets/JCImages'
import NetworkManager from '../../../../../network/NetworkManager';
import rest from '../../../../../network/rest';
import { renderJewel, jewelInfo } from '../../../../JCUtils/CommonUtils'
import actions from '../../../../../actions';
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomLoader from '../../../../shared_components/CustomLoader';

class TaskDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLaoding: false
        }
        this.task = this.props.navigation.state.params.task
    }

    componentDidMount() {
        console.log('TASK DETAILS', this.props);
        console.log('TASK', this.task.task_id);
        console.log('TASK', this.props.taskdetails.hasOwnProperty(this.task.task_id));
        if (!this.props.taskdetails.hasOwnProperty(this.task.task_id))
            this.getTaskDetails()
    }

    getTaskDetails() {
        console.log('TASK ID', this.props);
        let data = {
            'task_id': this.props.navigation.state.params.task.task_id
        }
        NetworkManager.callAPI(rest.getTaskElements, 'POST', data).then(result => {
            let data = JSON.parse(JSON.stringify(this.props.taskdetails))
            data[this.task.task_id] = result.taskdetails
            this.props.setTaskDetails(data)
            console.log('TASK DETAILS', this.props);
        }).catch(error => {

        })
    }

    

    jewelView(jewel) {
        
        
        let jewelView = []
        if(jewel.count<=5){
            for (let i = 0; i < jewel.count; i++) {
                jewelView.push(
                    renderJewel(jewel.jeweltype_id, 30, 30, styles.jewelStyle, jewel.jeweltype_id+'_'+i)
                )
            }
        }
        else{
            for (let i = 0; i < 3; i++) {
                jewelView.push(
                    renderJewel(jewel.jeweltype_id, 30, 30, styles.jewelStyle, jewel.jeweltype_id+'_'+i)
                )
            }
            jewelView.push(
                <View>
                    <Text style={{fontSize:20, color: color.lightcolor1, fontWeight:'bold'}}>...({jewel.count})</Text>
                </View>
            )
        }
        console.log('JEWELVIEW', jewelView)
        return jewelView
    }
    
    CheckAvailablity(RequiredJewel) {

        let jewel = this.props.game.jewels.filter((jewelType) => {
            return (RequiredJewel.jeweltype_id === jewelType.jeweltype_id)
        })
        console.log(RequiredJewel.count, jewel)
        if (jewel[0].count < RequiredJewel.count) {
            return true
        }
        else
            return false

    }
    CheckAvailablityForAllJewels() {
        let success = true
        this.props.taskdetails[this.task.task_id].map((jewel) => {
            if (this.CheckAvailablity(jewel)) {
                success = false
            }
        })
        return success
    }
    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <CustomLoader  loading={this.state.isLaoding}/>
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
                {this.props.taskdetails.hasOwnProperty(this.task.task_id) ?
                    <View style={{ paddingBottom: 20, flexDirection: 'column' }}>
                        {
                            this.props.taskdetails[this.task.task_id].map((jewel) => 
                                <View style={{ flexDirection: 'row', padding: 5 }} key={jewel.id}>
                                    <View style={{ flexDirection: 'row', width: '85%', paddingLeft: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        {this.jewelView(jewel)}
                                    </View>
                                    <View style={{ width: '15%' }}>
                                        {
                                            this.CheckAvailablity(jewel) 
                                            ? <TouchableOpacity onPress={()=>jewelInfo(jewel)} style={{flexDirection:'row'}}><Icon name='close' color='red' size={20} /><Icon style={{marginLeft:3}} name='info-circle' color='white' size={20} /></TouchableOpacity>
                                            : <Icon name='check' color='green' size={20} />
                                        }
                                    </View>
                                </View>
                            )
                        }

                    </View> : null}

            
                <View style={{ backgroundColor: color.darkcolor3, height: 0.5, width: '100%' }}></View>
                {this.props.taskdetails.hasOwnProperty(this.task.task_id) ?
                this.CheckAvailablityForAllJewels()?
                <TouchableOpacity disabled={!this.CheckAvailablityForAllJewels()} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }} onPress={() => {
                    let data = {
                        task_id: this.task.task_id,
                        id: this.task.id
                    }
                    if (this.CheckAvailablityForAllJewels()) {
                        this.setState(({
                            isLaoding: true
                        }))
                        NetworkManager.callAPI(rest.redeemTask, 'POST', data).then((result) => {

                            setTimeout(() => {
                                NetworkManager.callAPI(rest.checkTaskCompletion, 'POST', data).then((taskcompResult) => {
                                    NetworkManager.callAPI(rest.getNewTaskOnTaskCompletion, 'GET', null).then((newTask) => {
                                        console.log('new Task', newTask)
                                        this.setState(({
                                            isLaoding: false
                                        }))
                                        let data = JSON.parse(JSON.stringify(this.props.tasks))
                                        let taskIndex
                                        data.map((item, index) => {
                                            if (item.id == this.task.id && item.task_id == this.task.task_id) {
                                                taskIndex = index
                                            }
                                        })
                                        console.log('new Task1', taskIndex)
                                        if (newTask.newtask.length > 0)
                                            data.splice(taskIndex, 1, newTask.newtask[0])
                                        else
                                            data.splice(taskIndex, 1)
                                        this.props.setTaskData(data)
                                        this.props.loadGameState()
                                        this.props.navigation.navigate('SuccessFullGiftRedeem')
                                    }).catch(error => {
                                        console.log(error)
                                    })
                                }).catch(error => {

                                })
                            }, 2000);

                        }).catch(error => {

                        })
                    }
                }}>

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
                :
                <View style={{ alignItems: 'center', paddingTop: 10 }}>
                <View style={{ justifyContent: 'center', width: 220, alignItems: 'center', backgroundColor: color.darkcolor2, borderRadius: 5, borderWidth: 1, borderColor: color.lightcolor1, paddingHorizontal: 25, paddingVertical: 10 }}>
                  <Text style={{ color: color.jcgray }}>WIN POINTS & COINS</Text>
                </View>
              </View>
                :null}
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
        setTaskDetails: (payload) => (dispatch(actions.setTaskDetails(payload))),
        setTaskData: (payload) => dispatch(actions.setTaskData(payload)),
        loadGameState: () => dispatch(actions.loadGameState())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);