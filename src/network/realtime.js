import XMPP from "../utilities/xmpp/strophe";
import { store } from '../store'
import actions from '../actions'
import AsyncStorage from '@react-native-community/async-storage';
import db from '../db/localdatabase'

import {handlePresence} from './realtime-utils/presence-roster';
import {downloadMessages} from './realtime-utils/download-history';
import {getServerTime, detectMessagetype } from './realtime-utils/utilities';

import {insertIncomingMessageViaHistoryDownload, insertIncomingMessage, updateChatPageRedux, updateChatlistRedux } from './realtime-utils/messages';
import {handleReadAndDeliveryMessages, handleReadAndDeliveryMessagesViaHistoryDownload} from './realtime-utils/read-delivery-messages'

// const URL = 'ws://13.127.197.210:5280/ws-xmpp';
const URL = 'ws://localhost:5280/ws-xmpp';
let connection = new XMPP.Strophe.Connection(URL);
connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;


export default {
	getConnectionObj,
	realtimeConnect,
	realtimeDisconnect
	//sendReply,
	//sendReadReceipt,
	//sendSubscriptionRequest
}


export const getConnectionObj = () => {
	return connection;
}



export const realtimeConnect = () => {

	return (dispatch, getState) => {
		console.log('REALTIME CONNECT1');
		console.log(getState())
		// console.log(getState().mytoken.myphone + '@jewelchat')
		// console.log(getState().mytoken.token)
		//		connection.connect(getState().mytoken.myphone + '@jewelchat.net', getState().mytoken.token, (status, err) => {
		connection.connect(getState().mytoken.myphone + '@jewelchat.net', 'pass', (status, err) => {
			if (err) {
				console.log(' XMPP Error:' + err);
				//dispatch({ type: 'XMPP_ERROR' });
			}
			if (status == Strophe.Status.CONNECTING) {
				console.log('Strophe is connecting.');
				dispatch({ type: 'XMPP_CONNECTING' });
			} else if (status == Strophe.Status.CONNFAIL) {
				console.log('Strophe failed to connect.');
				dispatch({ type: 'XMPP_CONNECTION_FAIL' });
			} else if (status == Strophe.Status.AUTHENTICATING) {
				console.log('Strophe is authenticating.');
				dispatch({ type: 'XMPP_AUTHENTICATING' });
			} else if (status == Strophe.Status.AUTHFAIL) {
				dispatch({ type: 'XMPP_AUTH_FAILURE' });
				console.log('Strophe is auth failure.');
			} else if (status == Strophe.Status.DISCONNECTING) {
				dispatch({ type: 'XMPP_DISCONNECTING' });
				console.log('Strophe is disconnecting.');
			} else if (status == Strophe.Status.DISCONNECTED) {
				dispatch({ type: 'XMPP_DISCONNECTED' });
				console.log('Strophe is disconnected.');
				//save logout time
			} else if (status == Strophe.Status.CONNECTED) {
				dispatch({ type: 'XMPP_CONNECTED' });
				console.log('Strophe is connected.');	

				

				//dispatch(resendMessages(getState().mytoken.myphone + '@jewelchat.net'));


				// onMessage Handler
				connection.addHandler((msg) => {

					console.log(msg.toString());
					var processedMessage = detectMessagetype(msg)
					if (processedMessage.type === 'DownLoad') {
						if (processedMessage.subtype === 'Delivery' || processedMessage.subtype === 'Read') {
							dispatch(handleReadAndDeliveryMessagesViaHistoryDownload(processedMessage))
						}
						else if (processedMessage.subtype === 'Message' || processedMessage.type === 'GroupMessage')
							dispatch(insertIncomingMessageViaHistoryDownload(processedMessage.data))

						// else if (processedMessage.subtype === 'Affiliations' )
						// 	dispatch(insertIncomingAffiliationsViaHistoryDownload(processedMessage.data))		
					}
					else if (processedMessage.type === 'Read' || processedMessage.type === 'Delivery') {
						dispatch(handleReadAndDeliveryMessages(processedMessage))
					}
					else if (processedMessage.type === 'Message' || processedMessage.type === 'GroupMessage' )
						dispatch(insertIncomingMessage(processedMessage.data))

					// else if (processedMessage.type === 'Affiliations' )
					// 	dispatch(insertIncomingAffiliations(processedMessage.data))	

					return true

				}, null, 'message', null, null, null);

				// onPresence handler
				connection.addHandler((msg)=>{

					console.log(msg.toString());
					connection.roster.get((result) => {
						console.log('roster')
						console.log(result);
					});

					dispatch(handlePresence(msg, connection));					
					return true;

				}, null, 'presence', null, null, null);

				//send presence 
				connection.send($pres().tree(), () => {});


				getServerTime(getState().mytoken.myphone)
				.then(delta => {

					// download history since your last logout	after getting server time
					// AsyncStorage.getItem('logOutTime')
					// .then( lastlogouttime => {			
					// 	console.log('LOGOUT TIME', lastlogouttime);		
					// 	let current_servertime = new Date().getTime() + global.TimeDelta
					// 	lastlogouttime = current_servertime - parseInt(lastlogouttime) > 604800000 ? (current_servertime - 604800000) : parseInt(lastlogouttime);
					// 	dispatch(downloadMessages(connection, lastlogouttime));
					// });

				})
				.catch(err => {

				})

				
			}
		});
	}
}


export const realtimeDisconnect = () => {
	return (dispatch, getState) => {
		console.log('REALTIME DISCONNECT');
		connection.disconnect();
	}
}






