import XMPP from "../utilities/xmpp/strophe";
import { store } from '../store'
import actions from '../actions'
import AsyncStorage from '@react-native-community/async-storage';
import db from '../db/localdatabase'
const URL = 'ws://13.127.197.210:5280/ws-xmpp';

let connection = new XMPP.Strophe.Connection(URL);
connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;


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
				console.log(connection)
				getServerTime()
				dispatch(resendMessages(getState().mytoken.myphone + '@jewelchat.net'))
				connection.addHandler(onMessage, null, 'message', null, null, null);
				connection.addHandler(onPresence, null, 'presence', null, null, null);
				connection.send($pres().tree(), () => {
				});
				downloadMessages()
			}
		});
	}
}

function onPresence(msg) {
	console.log(msg.toString());
	return true;
}

//onMessage Handler
const onMessage = (msg) => {
	console.log(msg.toString());
	var processedMessage = detectMessagetype(msg)
	if (processedMessage.type == 'DownLoad') {
		if (processedMessage.subtype == 'Delivery' || processedMessage.subtype == 'Read') {
			store.dispatch(handleReadAndDeliveryMessages(processedMessage))
		}
		else if (processedMessage.subtype == 'Message')
			store.dispatch(insertIncomingMessage(processedMessage.data))
	}
	else if (processedMessage.type == 'Read' || processedMessage.type == 'Delivery') {
		store.dispatch(handleReadAndDeliveryMessages(processedMessage))
	}
	else if (processedMessage.type == 'Message')
		store.dispatch(insertIncomingMessage(processedMessage.data))
	return true
}

//function to sync device time with server time
function getServerTime() {
	console.log('CALLBACK serverTime SEND IQ')
	var serverTime = $iq({ type: 'get', from: store.getState().mytoken.myphone + '@jewelchat.net', to: 'jewelchat.net', id: 'time_1' })
		.c('time', { xmlns: 'urn:xmpp:time' });
	connection.sendIQ(serverTime.tree(), (stanza) => {
		console.log('CALLBACK serverTime SEND IQ')
		console.log(stanza.toString())
		var body = stanza.getElementsByTagName('utc')
		var time = new Date(Strophe.getText(body[0])).getTime()
		var delta = time - new Date().getTime()
		global.TimeDelta = delta
		console.log('Time delta', delta)
	},
		(error) => {
			console.log('error IQ')
			console.log(error.toString())
		});
}

//function to trigger messages download since last logout time of user
async function downloadMessages() {
	try {
		const value = await AsyncStorage.getItem('logOutTime');
		value = parseInt(value) - (new Date.getTime() + global.TimeDelta) > 604800000 ? (new Date.getTime() + global.TimeDelta - 604800000) : value
		if (value !== null) {
			// We have data!!
			console.log('date time', value);
			var download = $iq({ type: 'set' })
				.c('query', { xmlns: 'urn:xmpp:mam:2' })
				.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
				.c('field', { var: 'FORM_TYPE', type: 'hidden' })
				.c('value').t('urn:xmpp:mam:2')
				.up()
				.up()
				.c('field', { var: 'start' })
				.c('value').t(new Date(parseInt(value)).toISOString())
				.up()
				.up()
				.up()
				.c('set', { xmlns: 'http://jabber.org/protocol/rsm' })
				.c('max').t('20');
			connection.sendIQ(download.tree(), (stanza) => {
				console.log('CALLBACK SEND IQ')
				console.log(stanza.toString())
				var lastElement = stanza.getElementsByTagName('last')
				if (lastElement.toString()) {
					var last = Strophe.getText(lastElement[0])
					downloadPagination(last, value)
				}
				else {
					//update redux
				}
			});
		}
	} catch (error) {
		// Error retrieving data
	}

}

function downloadPagination(last, value) {
	console.log('download called')
	var download = $iq({ type: 'set' })
		.c('query', { xmlns: 'urn:xmpp:mam:2' })
		.c('x', { xmlns: 'jabber:x:data', type: 'submit' })
		.c('field', { var: 'FORM_TYPE', type: 'hidden' })
		.c('value').t('urn:xmpp:mam:2')
		.up()
		.up()
		.c('field', { var: 'start' })
		.c('value').t(new Date(parseInt(value)).toISOString())
		.up()
		.up()
		.up()
		.c('set', { xmlns: 'http://jabber.org/protocol/rsm' })
		.c('max').t('20').up()
		.c('after').t(last).up();
	console.log(download.toString())
	connection.sendIQ(download.tree(), (stanza) => {
		console.log('CALLBACK SEND IQ1')
		console.log(stanza.toString())
		var lastElement = stanza.getElementsByTagName('last')
		if (lastElement.toString()) {
			var last = Strophe.getText(lastElement[0])
			downloadPagination(last, value)
		}
		else {
			//update redux
		}
	});
}



//function to detect message type
function detectMessagetype(incomingStanza) {
	var type
	var subtype
	var data
	var fwd = incomingStanza.getElementsByTagName('forwarded');
	var recieved = incomingStanza.getElementsByTagName('received')
	var read = incomingStanza.getElementsByTagName('read')
	var date = dateToYMD((new Date()).getTime() + global.TimeDelta)

	if (fwd.toString()) {
		type = 'DownLoad'
		var delay = incomingStanza.getElementsByTagName('delay')
		var stamp = delay[0].getAttribute('stamp')
		var delayDate = dateToYMD(new Date(stamp).getTime())
		if (incomingStanza.getElementsByTagName('message').toString()) {
			var msg = incomingStanza.getElementsByTagName('message')[0]
			//Downloaded Delivery
			if (msg.getElementsByTagName('received').toString()) {
				subtype = 'Delivery'
				data = getFromattedReceipt(msg, subtype, new Date(stamp).getTime())
			}
			//Downloaded read
			else if (msg.getElementsByTagName('read').toString()) {
				subtype = 'Read'
				data = getFromattedReceipt(msg, subtype, new Date(stamp).getTime())
			}
			//Downloaded Incoming message
			else if (msg.getElementsByTagName('jewel').toString()) {
				subtype = 'Message'
				data = getFormattedMessages(msg, delayDate)
			}
		}
	}
	//incoming delivery receipt
	else if (recieved.toString()) {
		type = 'Delivery'
		data = getFromattedReceipt(incomingStanza, type)
	}
	//incoming read receipt
	else if (read.toString()) {
		type = 'Read'
		data = getFromattedReceipt(incomingStanza, type)
	}
	// incoming messages
	else {
		type = 'Message'
		data = getFormattedMessages(incomingStanza, date)
	}
	return ({ type: type, data: data, subtype: subtype })
}

function getFromattedReceipt(msg, type, time = (new Date()).getTime() + global.TimeDelta) {
	if (type == 'Delivery') {
		var message = msg.getElementsByTagName('received')
	}
	else {
		var message = msg.getElementsByTagName('read')
	}
	var receipt = {
		id: message[0].getAttribute('id'),
		time: time,
		to: msg.getAttribute('to'),
		from: msg.getAttribute('from').split('/')[0]
	}
	return receipt
}
function getFormattedMessages(msg, createdDateTime) {
	var jewel = msg.getElementsByTagName('jewel')
	var jewelType = jewel[0].getAttribute('number')
	var body = msg.getElementsByTagName('body')
	var message = Strophe.getText(body[0]);

	var incomingMessage = {
		CHAT_ROOM_JID: msg.getAttribute('from').split('/')[0],
		MSG_TEXT: message,
		CREATOR_JID: msg.getAttribute('from').split('/')[0],
		JEWEL_TYPE: parseInt(jewelType),
		CREATED_DATE: createdDateTime.date,
		CREATED_TIME: createdDateTime.time,
		SENDER_MSG_ID: msg.getAttribute('id'),
		MSG_TYPE: 0,
		SEQUENCE: -1
	}
	return incomingMessage
}


export const handleReadAndDeliveryMessages = (processedMessage) => {
	return (dispatch, getState) => {
		var type = processedMessage.type == 'DownLoad' ? processedMessage.subtype : processedMessage.type
		console.log('processedMessage')
		console.log(processedMessage, type)
		if (processedMessage.data.from != getState().mytoken.myphone + '@jewelchat.net') {
			console.log('called')
			db.updateDeliveryAndReadRecipt(type, processedMessage.data.id, processedMessage.data.time).then(result => {
				if (getState().chatslist.activeChat.JID == processedMessage.data.from) {
					dispatch(updateChatData(type, processedMessage.data.id, processedMessage.data.time))
				}
				console.log('success')
			}).catch(err => {
			})
		}
	}
}

export const updateChatData = (type, id, time) => {
	console.log(type, id, time)
	return (dispatch, getState) => {
		var chatData = JSON.parse(JSON.stringify(getState().chatroom.chatroom))
		console.log(chatData)
		chatData.map((item) => {
			if (item._ID == id) {
				if (type == 'Delivery') {
					item['IS_DELIVERED'] = 1
					item['TIME_DELIVERED'] = time
				}
				else if (type == 'Read') {
					item['IS_READ'] = 1
					item['TIME_READ'] = time
				}
				else {
					item['IS_SUBMITTED'] = 1
					item['TIME_SUBMITTED'] = time
				}
				dispatch(actions.setChatData(chatData))
			}
		})
	}
}

//function to handle messages send as a reply to any JID
export const sendReply = (messageText, chatroom) => {

	return (dispatch, getState) => {
		console.log(global.TimeDelta)
		var createdDateTime = (new Date()).getTime() + global.TimeDelta
		var date = dateToYMD(createdDateTime);
		var message = {
			CHAT_ROOM_JID: chatroom,
			MSG_TEXT: messageText,
			CREATOR_JID: getState().mytoken.myphone + '@jewelchat.net',
			JEWEL_TYPE: null,
			CREATED_DATE: date.date,
			CREATED_TIME: date.time,
			MSG_TYPE: 0,
			SENDER_MSG_ID: null
		}
		db.insertStropheChatData(message).then((result) => {
			message['_ID'] = result
			message['SENDER_MSG_ID'] = result
			dispatch(actions.addChatMessage(message))

			var reply = $msg({ to: message.CHAT_ROOM_JID, from: message.CREATOR_JID, type: 'chat', id: message._ID })
				.cnode(Strophe.xmlElement('body', message.MSG_TEXT))
				.up()
				.c('active', { xmlns: "http://jabber.org/protocol/chatstates" });
			dispatch(updateChatlist(message, createdDateTime, 'Active'))
			connection.send(reply.tree(), () => {
				console.log('reply triggered')
				db.updateDeliveryAndReadRecipt('Submit', result, createdDateTime).then(status => {
					dispatch(updateChatData('Submitted', result, createdDateTime))
				})
			});
		}).catch(err => {

		})
	}
}

// function to convert date in ms to specified format ('YYYY-DD-MM' & 'HH:MM:SS')
function dateToYMD(createdDateTime) {
	var d = new Date(parseInt(createdDateTime))
	var date = d.toLocaleString().split(', ')[0].split('/').reverse().join("-")
	var time = d.toLocaleString().split(', ')[1]
	return { date: date, time: time };
}

// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessage = (incomingMessage) => {
	var createdDateTime = (new Date()).getTime() + global.TimeDelta

	return (dispatch, getState) => {
		db.insertStropheChatData(incomingMessage).then((result) => {
			incomingMessage['_ID'] = result
			//send read reciept if activechat
			if (getState().chatslist.activeChat.JID == incomingMessage.CHAT_ROOM_JID) {
				dispatch(actions.addChatMessage(incomingMessage))

				dispatch(updateChatlist(incomingMessage, createdDateTime, 'Active'))

				db.updateDeliveryAndReadRecipt('Both', result, createdDateTime)
				var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
					.c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID, time: createdDateTime })

				connection.send(received.tree(), () => {
					//database single ticks
				});
				var read = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
					.c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })

				connection.send(read.tree(), () => {
					//database single ticks
				});
			}
			//otherwise send delivery recipt
			else {
				dispatch(updateChatlist(incomingMessage, createdDateTime, 'InActive'))

				db.updateDeliveryAndReadRecipt('Delivery', result, createdDateTime)

				var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
					.c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })

				connection.send(received.tree(), () => {
					//database single ticks
				});
			}

		}).catch(err => {

		})
	}
}

//function to send read receipt for already delivered messages
export const sendReadReceipt = (JID) => {
	var createdDateTime = (new Date()).getTime() + global.TimeDelta
	var date = dateToYMD(createdDateTime);
	return (dispatch, getState) => {
		db.selectUnreadMessages(JID).then(result => {
			if (result.rows.length > 0) {
				for (let i = 0; i < result.rows.length; i++) {
					db.updateDeliveryAndReadRecipt('Read', result.rows.item(i)._ID, createdDateTime)

					var read = $msg({ to: JID, from: getState().mytoken.myphone + '@jewelchat.net' })
						.c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: result.rows.item(i).SENDER_MSG_ID, time: createdDateTime })

					connection.send(read.tree(), () => {
						//database single ticks
					});
				}
			}
		}).catch(err => {

		})
	}
}

//function to Re-send non submitted messages
export const resendMessages = (JID) => {
	console.log('JID', JID)
	var createdDateTime = (new Date()).getTime() + global.TimeDelta
	var date = dateToYMD(createdDateTime);
	return (dispatch, getState) => {
		db.selectUnsendMessages(JID).then(result => {
			if (result.rows.length > 0) {
				for (let i = 0; i < result.rows.length; i++) {
					var message = result.rows.item(i)
					var reply = $msg({ to: message.CHAT_ROOM_JID, from: message.CREATOR_JID, type: 'chat', id: message._ID, createdDate: createdDateTime })
						.cnode(Strophe.xmlElement('body', message.MSG_TEXT))
						.up()
						.c('active', { xmlns: "http://jabber.org/protocol/chatstates" });
					connection.send(reply.tree(), () => {
						console.log('reply triggered')
						db.updateDeliveryAndReadRecipt('Submit', message._ID, createdDateTime)
						dispatch(updateChatlist(message, createdDateTime, 'Active'))
					});
				}
			}
		}).catch(err => {

		})
	}
}


// function to update chat list on any messaging activity
export const updateChatlist = (message, createdDateTime, messageType) => {
	console.log('test came', createdDateTime)
	console.log(message)
	return (dispatch, getState) => {
		db.updateLastMessageAndText(message, createdDateTime, messageType).then(result => {
			if (result == 'success') {
				let chatList = JSON.parse(JSON.stringify(getState().chatslist.chatList))
				chatList.map((chatItem, index) => {
					if (chatItem.JID == message.CHAT_ROOM_JID) {
						chatList[index]['LAST_MSG_CREATED_TIME'] = createdDateTime
						chatList[index]['MSG_TEXT'] = message.MSG_TEXT
						chatList[index]['MSG_TYPE'] = message.MSG_TYPE
						if (messageType != 'Active') {
							chatList[index]['UNREAD_COUNT'] = chatList[index]['UNREAD_COUNT'] + 1
						}
						else {
							chatList[index]['UNREAD_COUNT'] = 0
						}
					}
				})
				dispatch(actions.setChatListData(chatList))
			}
		}).catch(err => {

		})
	}
}


export const realtimeDisconnect = () => {
	return (dispatch, getState) => {
		console.log('REALTIME DISCONNECT');
		connection.disconnect();
	}
}



export default {
	realtimeConnect,
	realtimeDisconnect,
	sendReply,
	sendReadReceipt
}

/*

export const xmppConnect = (userToken) => {
	console.log('XMPP');
    return (dispatch, getState) => {

				dispatch({ type: 'XMPP_START_CONNECTING' });

				connection = new XMPP.Strophe.Connection(this.WEBSOCKET_SERVICE);

				connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;

				connection.connect('user1@jewelchat', userToken, () => {

						if(err){
							console.log('Error:'+err);
							dispatch({ type: 'XMPP_ERROR' });
						}

						if (status == Strophe.Status.CONNECTING) {
							console.log('Strophe is connecting.');
							dispatch({ type: 'XMPP_CONNECTING' });
						} else if (status == Strophe.Status.CONNFAIL) {
							console.log('Strophe failed to connect.');
							dispatch({ type: 'XMPP_CONNECTIOn_FAIL' });
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
						} else if (status == Strophe.Status.CONNECTED) {
							dispatch({ type: 'XMPP_CONNECTED' });

							connection.addHandler((msg)=>{




							}, null, 'message', null, null,  null);

							connection.send($pres().tree());
							connection.roster.init(connection);

							console.log('Strophe is connected.');
						}

				});

    }

}



*/
