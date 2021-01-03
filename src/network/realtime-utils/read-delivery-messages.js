import db from '../../db/localdatabase'
import {updateChatPageRedux, updateChatlistRedux} from './messages';

export const handleReadAndDeliveryMessages = (processedMessage) => {
	return (dispatch, getState) => {
		var type = processedMessage.type;		
		if (processedMessage.data.from != getState().mytoken.myphone + '@jewelchat.net') {
			db.updateDeliveryAndReadReceipt(type, processedMessage.data.id, processedMessage.data.time).then(result => {
				
				if (getState().activechat.JID === processedMessage.data.from) 
					dispatch(updateChatPageRedux());                    
                
                dispatch(updateChatlistRedux());
                
			}).catch(err => {})
		}
	}
}


export const handleReadAndDeliveryMessagesViaHistoryDownload = (processedMessage) => {
	return (dispatch, getState) => {
		var type = processedMessage.subtype;
		if (processedMessage.data.from != getState().mytoken.myphone + '@jewelchat.net') {
            db.updateDeliveryAndReadReceipt(type, processedMessage.data.id, processedMessage.data.time)
            .then(result => {}).catch(err => {})
		}
	}
}


export const sendBulkReadReceipts = (CHAT_ROOM_JID, myjid) => {
	
		db.getAllNotReadMsgID(CHAT_ROOM_JID).then(ids => {
			let p = [];
			for(let i=0; i< ids.lenngth; i++){
				p.push(new Promise((resolve, reject) => {
					try{

						let read = $msg({ to: CHAT_ROOM_JID, from: myjid })
						.c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: ids[i] });
						
						getConnectionObj().send(read.tree(), () => {
							resolve('Success')
						});

					}catch(err){
						reject('Error')
					}
				}))

			}
			let createdDateTime = new Date().getTime() + global.TimeDelta
			p.all().then(val => {
				db.updateAllReadReceipts(ids, createdDateTime).then().catch();
			}).catch(err => {
				db.updateAllReadReceipts(ids, createdDateTime).then().catch();
			});

		}).catch(err => {})
	
}

