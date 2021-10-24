import React from "react";
import {    
    ScrollView,
    SafeAreaView,
    View,    
    Text,
    TouchableOpacity,
    Image    
} from "react-native";

import { Item, Input, Textarea, Form } from 'native-base';

import colors from '../../../shared_styles/colors'

import { connect } from 'react-redux';

import {getConnectionObj} from '../../../../network/realtime-utils/realtimeobj';

import db from '../../../../db/localdatabase';

import CustomLoader from "../../../shared_components/CustomLoader";

class AdminStuff extends React.Component {
    
    constructor(props) {
        super(props)  
        this.state = {
					isLoading:false
				}
    }
	

    componentDidMount() {	}

		ASdeleteAllLocalMessage=()=>{

				this.setState({					          
					isLoading: true
				});
				console.log('Here', this.state.isLoading)
				db.deleteAllData()
				.then(val=>{
						this.setState({					          
							isLoading: false
						});
				})
				.catch((err)=>{
						this.setState({					          
							isLoading: false
						});
				})

		}
		


		ASdownloadMessages = (t, last=null ) => {
				

				this.setState({					          
					isLoading: true
				});

				let download = $iq({ type: 'set' })
											.c('query', { xmlns: 'urn:xmpp:mam:2' })
													.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
															.c('field', { var: 'FORM_TYPE', type: 'hidden' })
																	.c('value').t('urn:xmpp:mam:2')
																	.up()
															.up()
															.c('field', { var: 'start' })
																	.c('value').t(new Date(parseInt(t)).toISOString())
															.up()
													.up()
											.up()
											.c('set', { xmlns: 'http://jabber.org/protocol/rsm' })
													.c('max').t('10');

				if(last)
					download = download.up().c('after').t(last).up();

				getConnectionObj().sendIQ(download.tree(), (stanza) => {

						let lastElement = stanza.getElementsByTagName('last')
						if (lastElement.toString()) {
								let last = Strophe.getText(lastElement[0])
								this.ASdownloadMessages( t, last);
						}else{
							this.setState({
								isLoading:false
							})
						}
						
				}); 	

		}


		ASDM1day(){
			let t = new Date().getTime() + global.TimeDelta - (24*60*60*1000)
			ASdownloadMessages(t)
		}

		ASDM1hour(){
			let t = new Date().getTime() + global.TimeDelta - (60*60*1000)
			this.ASdownloadMessages(t)
		}

    

    
    render() {
        return (
            <SafeAreaView style={{flex:1, backgroundColor:colors.darkcolor1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>    
                
							<CustomLoader loading={this.state.isLoading} />     
								{/* <TouchableOpacity style={{backgroundColor:colors.lightcolor2, padding:10, margin:10 }}>
									<Text style={{color:'white'}}>All Gifts</Text>
								</TouchableOpacity> */}

								{/* <View style={{flexDirection:'row', justifyContent:'space-between', height:44, marginTop:25, marginBottom:15}}>
														<Item regular style={{ width: '70%', alignSelf:'center' ,color: colors.lightcolor1, borderColor: colors.lightcolor1, borderRadius:5}}>
                                <Input placeholder='JID'
                                maxLength = {30}                               
                                style={{ color: colors.lightcolor1}} />
                            </Item>
                            <TouchableOpacity															
															style={{ alignSelf:'flex-end', backgroundColor: colors.lightcolor2, height:'100%', width: 70, alignItems: 'center', borderColor: colors.lightcolor1, justifyContent: 'center', borderWidth: 1.5, borderRadius: 5 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Download Messages</Text>
                            </TouchableOpacity>
								</View> */}

								<TouchableOpacity style={{backgroundColor:colors.lightcolor2, padding:10, margin:10 }} onPress={()=>this.ASdownloadMessages(new Date().getTime() + global.TimeDelta - (7*24*60*60*1000))}>
									<Text style={{color:'white'}}>Download 1 year messages</Text>
								</TouchableOpacity>

								<TouchableOpacity style={{backgroundColor:colors.lightcolor2, padding:10, margin:10 }} onPress={()=>this.ASdownloadMessages(new Date().getTime() + global.TimeDelta - (24*60*60*1000))}>
									<Text style={{color:'white'}}>Download 1 days messages</Text>
								</TouchableOpacity>

								<TouchableOpacity style={{backgroundColor:colors.lightcolor2, padding:10, margin:10 }} onPress={()=>this.ASdownloadMessages(new Date().getTime() + global.TimeDelta - (60*60*1000))}>
									<Text style={{color:'white'}}>Download last 1 hour messages</Text>
								</TouchableOpacity>

								<TouchableOpacity style={{backgroundColor:colors.lightcolor2, padding:10, margin:10 }} onPress={this.ASdeleteAllLocalMessage}>
									<Text style={{color:'white'}}>Delete All local messages</Text>
								</TouchableOpacity>

								
                
            </SafeAreaView >
        );
    }
}

function mapStateToProps(state) {
    return {
        mytoken: state.mytoken
    };
}


function mapDispatchToProps(dispatch) {
    return {
        tokenLoad: (myTokens) => dispatch({ type: 'USER_TOKEN_LOADED', myTokens })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminStuff);

//+ '?' + new Date()