import XMPP from "../utilities/xmpp/strophe";
import {store} from '../store'
import actions from '../actions'
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
	console.log(store)
	console.log('test')
	console.log(msg.toString());
	console.log(msg.getAttribute('to'))
	console.log(msg.getAttribute('from'))
	console.log(msg.getAttribute('type'))
	var jewel = msg.getElementsByTagName('jewel')
	var jewelType = jewel[0].getAttribute('number')
	var body = msg.getElementsByTagName('body')
	var message = Strophe.getText(body[0]);
	//console.log(message)

	var received = $msg({ to: '2@jewelchat.net', from: '1@jewelchat.net' })
		.c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: 'received_msg_id' })
	connection.send(received.tree(), () => {
		//database single tick
	});
	var IncomingMessage = {
		CHAT_ROOM_JID: msg.getAttribute('from').split('/')[0],
		MSG_TEXT: message,
		CREATOR_JID: msg.getAttribute('from').split('/')[0],
		JEWEL_TYPE: parseInt(jewelType),
		CREATED_DATE: '2020-01-14',
		CREATED_TIME: '16:00:00',
		MSG_TYPE: 0
	}
	store.dispatch(insertMessageToDb(IncomingMessage))

	return true

}

export const sendReply = (message) => {
	return (dispatch, getState) => {
		var reply = $msg({ to: message.CHAT_ROOM_JID, from: '1@jewelchat.net', type: 'chat' })
			.cnode(Strophe.xmlElement('body', message.MSG_TEXT))
			.up()
			.c('active', { xmlns: "http://jabber.org/protocol/chatstates" });
		connection.send(reply.tree());
	}
}

export const insertMessageToDb = (message) => {
	console.log(";came to")
	console.log(message)
	return (dispatch, getState) => {
		console.log(message)
		dispatch(actions.addChatMessage(message))
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
