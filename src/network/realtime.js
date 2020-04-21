import XMPP from "../utilities/xmpp/strophe";

const URL = 'ws://13.233.85.150:5280/ws-xmpp';

let connection = new XMPP.Strophe.Connection(URL);				
connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;


export const realtimeConnect = () => {

	return (dispatch, getState) => {

		
		console.log('REALTIME CONNECT');
		console.log(getState());

		connection.connect(getState().mytoken.myphone + '@jewelchat', getState().mytoken.token, (status, err) => {

			if(err){
				console.log('Error:'+err);
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
				dispatch({ type: 'XMPP_CONNECTED' });
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



export default {
	realtimeConnect,
	realtimeDisconnect
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
