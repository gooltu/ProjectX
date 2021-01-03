import XMPP from "../../utilities/xmpp/strophe";

const URL = 'wss://chat.jewelchat.net/ws-xmpp';
//const URL = 'ws://localhost:5280/ws-xmpp';
let connection = new XMPP.Strophe.Connection(URL);
connection.registerSASLMechanism = XMPP.Strophe.SASLXOAuth2;
// connection.rawInput = (data) => {
// 	console.log('XMPP RECV', data)
// };
// connection.rawOutput = (data) => {
// 	console.log('XMPP SENT', data)
// };

export const getConnectionObj = () => {
	return connection;
}

