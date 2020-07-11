import db from '../../db/localdatabase';
import {getConnectionObj} from '../realtime';

// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessageViaHistoryDownload = (incomingMessage) => {
	return (dispatch, getState) => {
		db.insertStropheChatData(incomingMessage).then((_id) => {
			incomingMessage['_ID'] = _id;            
            _sendReceiptsOnReceivingMessages(incomingMessage, getState);    

		}).catch(err => {})
	}
}



// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessage = (incomingMessage) => {
	return (dispatch, getState) => {
		db.insertStropheChatData(incomingMessage).then((_id) => {
			incomingMessage['_ID'] = _id            
            _sendReceiptsOnReceivingMessages(incomingMessage, getState);          
            dispatch(updateChatPageRedux);
            dispatch(updateChatlistRedux);           

		}).catch(err => {})
	}
}



export const updateChatPageRedux = () => {
	return (dispatch, getState) => {
		if (getState().chatslist.activeChat.JID && getState().chatroom.chatroom.length>0){

            let chatroom_JID = chatslist.activeChat.JID;
            let chatroom_length = getState().chatroom.chatroom.length;                            
            let lowest_ID = getState().chatroom.chatroom[chatroom_length - 1]._ID;

            db.getAllChatsGreaterThanEqual_ID(chatroom_JID, lowest_ID)
            .then(chatdata => {
                dispatch(actions.setChatData(chatdata))
            })

        }
	}
}


export const updateChatlistRedux = () => {
	return (dispatch, getState) => {
		db.getChatList().then(chatlist => {
            console.log('FROM JEWELCHAT COMPONENT GETCHATLIST SUCCESS')
            console.log(chatlist.rows.length)                           
            dispatch(actions.setChatListData(chatlist))                            
        })
	}
}







function _sendReceiptsOnReceivingMessages(incomingMessage, getState){    

    var createdDateTime = new Date().getTime() + global.TimeDelta
            
    //send read reciept if activechat            
    if(!incomingMessage.IS_GROUP_MSG){

        // sending delivery receipt
        var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
            .c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })
            getConnectionObj().send(received.tree(), () => {
            db.updateDeliveryAndReadRecipt('Delivery', _id, createdDateTime).then(()=>{}).catch(err => {});
        }); 

        // if active chat send read receipt
        if (getState().chatslist.activeChat.JID == incomingMessage.CHAT_ROOM_JID) {	                    

            var read = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
                .c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })
                getConnectionObj().send(read.tree(), () => {
                db.updateDeliveryAndReadRecipt('Read', _id, createdDateTime).then(()=>{}).catch(err => {});
            });                   
                

        }
    
    } 

}


