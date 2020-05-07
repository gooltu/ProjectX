import XMPP from "../utilities/xmpp/strophe";
import { store } from '../store'
import actions from '../actions'
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
		//		connection.connect(getState().mytoken.myphone + '@jewelchat', getState().mytoken.token, (status, err) => {
		connection.connect('1@jewelchat.net', 'pass', (status, err) => {
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
			} else if (status == Strophe.Status.CONNECTED) {
				console.log('Strophe is connected.');
				console.log(connection)
				connection.addHandler(onMessage, null, 'message', null, null, null);
				connection.addHandler(onPresence, null, 'presence', null, null, null);
				connection.send($pres().tree());
			}
		});
	}
}

function onPresence(msg) {
	console.log(msg.toString());
	return true;
}

const onMessage = (msg) => {
	store.dispatch(insertIncomingMessage(msg))
	return true
}
export const sendReply = (messageText, chatroom) => {
	var createdDateTime = (new Date()).getTime()
	var date = dateToYMD(createdDateTime);
	var message = {
		CHAT_ROOM_JID: chatroom,
		MSG_TEXT: messageText,
		CREATOR_JID: '1@jewelchat.net',
		JEWEL_TYPE: null,
		CREATED_DATE: date.date,
		CREATED_TIME: date.time,
		MSG_TYPE: 0,
		SENDER_MSG_ID: null
	}
	return (dispatch, getState) => {
		db.insertStropheChatData(message).then((result) => {
			message['_ID'] = result
			message['SENDER_MSG_ID'] = result
			dispatch(actions.addChatMessage(message))

			var reply = $msg({ to: message.CHAT_ROOM_JID, from: message.CREATOR_JID, type: 'chat', id: message._ID, createdDate: createdDateTime })
				.cnode(Strophe.xmlElement('body', message.MSG_TEXT))
				.up()
				.c('active', { xmlns: "http://jabber.org/protocol/chatstates" });
			dispatch(updateChatlist(message,createdDateTime))
			connection.send(reply.tree(), () => {
				dispatch(updateChatlist(message))
				console.log('reply triggered')
			});
		}).catch(err => {

		})
	}
}


function dateToYMD(createdDateTime) {

	var d = new Date(parseInt(createdDateTime));
	var date = d.toLocaleString().split(', ')[0].split('/').reverse().join("-")
	var time = d.toLocaleString().split(', ')[1]
	return { date: date, time: time };
}

export const insertIncomingMessage = (msg) => {

	var jewel = msg.getElementsByTagName('jewel')
	var jewelType = jewel[0].getAttribute('number')
	var body = msg.getElementsByTagName('body')
	var message = Strophe.getText(body[0]);
	var createdDateTime = msg.getAttribute('createdDate')
	var date = dateToYMD(createdDateTime)
	var incomingMessage = {
		CHAT_ROOM_JID: msg.getAttribute('from').split('/')[0],
		MSG_TEXT: message,
		CREATOR_JID: msg.getAttribute('from').split('/')[0],
		JEWEL_TYPE: parseInt(jewelType),
		CREATED_DATE: date.date,
		CREATED_TIME: date.time,
		SENDER_MSG_ID: msg.getAttribute('id'),
		MSG_TYPE: 0
	}

	return (dispatch, getState) => {
		db.insertStropheChatData(incomingMessage).then((result) => {
			incomingMessage['_ID'] = result
			var dateTime = dateToYMD()
			//send read reciept if activechat
			if (getState().chatslist.activeChat.JID == incomingMessage.CHAT_ROOM_JID) {
				dispatch(actions.addChatMessage(incomingMessage))

				var read = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: '1@jewelchat.net' })
					.c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID, time: dateTime.time })

				connection.send(read.tree(), () => {
					//database single ticks
				});
			}
			//otherwise send delivery recipt
			else {
				dispatch(updateChatlist(incomingMessage, createdDateTime))
				var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: '1@jewelchat.net' })
					.c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID, time: dateTime.time })

				connection.send(received.tree(), () => {
					//database single ticks
				});
			}

		}).catch(err => {

		})
	}
}


export const updateChatlist = (message, createdDateTime) => {
	console.log('test came')
	console.log(message)
	return (dispatch, getState) => {
		db.updateLastMessageAndText(message).then(result => {
			if (result == 'success') {
				let chatList = JSON.parse(JSON.stringify(getState().chatslist.chatList))
				chatList.map((chatItem, index) => {
					if (chatItem.JID == message.CHAT_ROOM_JID) {
						chatList[index]['LAST_MSG_CREATED_TIME'] = createdDateTime
						chatList[index]['MSG_TEXT'] = message.MSG_TEXT
						chatList[index]['MSG_TYPE'] = message.MSG_TYPE
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
	sendReply
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
