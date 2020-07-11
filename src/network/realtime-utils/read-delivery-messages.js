import db from '../../db/localdatabase'
import {updateChatPageRedux, updateChatlistRedux} from './messages';

export const handleReadAndDeliveryMessages = (processedMessage) => {
	return (dispatch, getState) => {
		var type = processedMessage.type;
		if (processedMessage.data.from != getState().mytoken.myphone + '@jewelchat.net') {
			db.updateDeliveryAndReadReceipt(type, processedMessage.data.id, processedMessage.data.time).then(result => {
				if (getState().chatslist.activeChat.JID == processedMessage.data.from) 
					dispatch(updateChatPageRedux);                    
                
                dispatch(updateChatlistRedux);
                
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

