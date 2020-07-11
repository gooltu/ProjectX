import {getConnectionObj} from '../realtime';

export const getServerTime = () => {
	var serverTime = $iq({ type: 'get', from: store.getState().mytoken.myphone + '@jewelchat.net', to: 'jewelchat.net', id: 'time_1' })
		.c('time', { xmlns: 'urn:xmpp:time' });
		getConnectionObj().sendIQ(serverTime.tree(), (stanza) => {
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


export const detectMessagetype = (incomingStanza) => {
	var type
	var subtype
	var data
	var fwd = incomingStanza.getElementsByTagName('forwarded');
	var recieved = incomingStanza.getElementsByTagName('received')
	var read = incomingStanza.getElementsByTagName('read')
	var date = _dateToYMD((new Date()).getTime() + global.TimeDelta)

	if (fwd.toString()) {
		type = 'DownLoad'
		var delay = incomingStanza.getElementsByTagName('delay')
		var stamp = delay[0].getAttribute('stamp')
		var delayDate = _dateToYMD(new Date(stamp).getTime())
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
			else if (msg.getAttribute('chat').toString()) {
				subtype = 'Message'
				data = getFormattedMessages(msg, delayDate, IS_GROUP_MSG=0)
			}
			else if(msg.getAttribute('groupchat').toString()){
				if(msg.getElementsByTagName('x').toString()){
					subtype = 'Affiliations'
					data = getFormattedAffiliations(msg, delayDate)
				}
				else if(msg.getElementsByTagName('body').toString()){
					subtype = 'GroupMessage'
					data = getFormattedMessages(msg, delayDate, IS_GROUP_MSG=1)
				}
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
	else if(msg.getAttribute('chat').toString()) {
		type = 'Message'
		data = getFormattedMessages(incomingStanza, date, IS_GROUP_MSG=0)
	}
	else if(msg.getAttribute('groupchat').toString()){
		if(msg.getElementsByTagName('x').toString()){
			type = 'Affiliations'
			data = getFormattedAffiliations(msg, date)
		}
		else if(msg.getElementsByTagName('body').toString()){
			type = 'GroupMessage'
			data = getFormattedMessages(msg, date, IS_GROUP_MSG=1 )
		}
	}
	return ({ type: type, data: data, subtype: subtype })
}



function getFormattedAffiliations(msg, createdDateTime) {

	affiliationText = "Affiliation message";

	var affiliationMessage = {
		CHAT_ROOM_JID: msg.getAttribute('from').split('/')[0],
		IS_GROUP_MSG: 1,
		MSG_TEXT: affiliationText,
		CREATOR_JID: msg.getAttribute('from').split('/')[0],		
		CREATED_DATE: createdDateTime.date,
		CREATED_TIME: createdDateTime.time,		
		MSG_TYPE: -1		
	}
	return affiliationMessage
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

function getFormattedMessages(msg, createdDateTime, IS_GROUP_MSG ) {
	console.log(msg.toString())
	var jewel = msg.getElementsByTagName('jewel')
	var jewelType = jewel[0].getAttribute('number')
	var subtype = msg.getAttribute('subtype')
	console.log(subtype)
	var reply = ( subtype === 'reply' ) ? 1 : 0
	var forward = ( subtype === 'forward' ) ? 1 : 0
	var parent = msg.getAttribute('parent')
	var body = msg.getElementsByTagName('body')
	var message = Strophe.getText(body[0]);
	var media = msg.getElementsByTagName('media')



	var incomingMessage = {
		CHAT_ROOM_JID: msg.getAttribute('from').split('/')[0],
		IS_GROUP_MSG: IS_GROUP_MSG,
		MSG_TEXT: message,
		CREATOR_JID: msg.getAttribute('from').split('/')[0],
		GROUP_MEMBER_JID: (IS_GROUP_MSG == 1 ? msg.getAttribute('from').split('/')[1] : msg.getAttribute('from').split('/')[0]),
		JEWEL_TYPE: parseInt(jewelType),
		CREATED_DATE: createdDateTime.date,
		CREATED_TIME: createdDateTime.time,
		SENDER_MSG_ID: msg.getAttribute('id'),
		MSG_TYPE: ( media ? ( parseInt(media[0].getAttribute('number')) ) : 0 ),
		MEDIA_CLOUD: (media ? (Strophe.getText(media[0])) : null ),
		SEQUENCE: -1,
		IS_REPLY: reply,
		IS_FORWARD: forward,
		REPLY_PARENT: parent
	}
	return incomingMessage
}



// function to convert date in ms to specified format ('YYYY-DD-MM' & 'HH:MM:SS')
function _dateToYMD(createdDateTime) {
	console.log(createdDateTime)
	var d = new Date(parseInt(createdDateTime))
	//	var date = new Date(1590419829139)
	var day = d.getDate()
	var month = d.getMonth() + 1
	var year = d.getFullYear()
	var hour = d.getHours()
	var mins = d.getMinutes()
	var seconds = d.getSeconds()
	var date = (day < 10 ? '0' + day : day) + '-' + (month < 10 ? '0' + month : month) + '-' + year
	var time = (hour < 10 ? '0' + hour : hour) + ':' + (mins < 10 ? '0' + mins : mins) + ':' + (seconds < 10 ? '0' + seconds : seconds)
	// var date = d.toLocaleString().split(', ')[0].split('/').reverse().join("-")
	// var time = d.toLocaleString().split(', ')[1]
	return { date: date, time: time };
}

