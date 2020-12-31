import db from '../../db/localdatabase';
//import {getConnectionObj} from '../realtime';
import actions from '../../actions'

// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessageViaHistoryDownload = (incomingMessage) => {
	return (dispatch, getState) => {
        if(incomingMessage.CREATOR_JID.split('@')[0] !== getState().mytoken.myphone){
            db.insertStropheChatData(incomingMessage).then((_id) => {

                if(incomingMessage.IS_GROUP_MSG != 1){
                    incomingMessage['_ID'] = _id            
                    _sendReceiptsOnReceivingMessages(incomingMessage, getState);
                }    
    
            }).catch(err => {})
        }
		
	}
}



// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessage = (incomingMessage) => {

	return (dispatch, getState) => {       

        if(incomingMessage.CREATOR_JID.split('@')[0] !== getState().mytoken.myphone){
            db.insertStropheChatData(incomingMessage).then((_id) => {

                     
                dispatch(updateChatPageRedux());
                dispatch(updateChatlistRedux()); 
                if(incomingMessage.IS_GROUP_MSG != 1){
                    incomingMessage['_ID'] = _id            
                    _sendReceiptsOnReceivingMessages(incomingMessage, getState);
                }

            }).catch(err => {})
        }else{
            // Update delivered flag
        }

	}
}


export const updateChatPageRedux = () => {
	return (dispatch, getState) => {
        
		if(getState().activechat.CHAT_ROOM_JID){
            console.log('Here1');
            let chatroom_JID = getState().activechat.CHAT_ROOM_JID;
            let isgroupmsg = getState().activechat.IS_GROUP_MSG;
            if(getState().chatroom.chatroom.length>0){
                
                let chatroom_length = getState().chatroom.chatroom.length;                            
                let lowest_ID = getState().chatroom.chatroom[chatroom_length - 1]._ID;

                db.getAllChatsGreaterThanEqual_ID(chatroom_JID, lowest_ID, isgroupmsg)
                .then(chatdata => {
                    dispatch(actions.setChatData(chatdata))
                })

            }else if(getState().chatroom.chatroom.length == 0){
                db.getChats(chatroom_JID, 0, isgroupmsg)
                .then(chatdata => {       
                    console.log('Update Chat Page Redux Initial load') 
                    console.log(chatdata);            
                    dispatch(actions.setChatData(chatdata))
                })
            }     

        }
	}
}


export const updateChatlistRedux = () => {
    console.log('Getting chat list')
	return (dispatch, getState) => {
		db.getChatList().then(chatlist => {
            console.log('FROM JEWELCHAT COMPONENT GETCHATLIST SUCCESS')
            console.log(chatlist)                           
            dispatch(actions.setChatListData(chatlist))                            
        })
	}
}


function _sendReceiptsOnReceivingMessages(incomingMessage, getState, connection){    

    var createdDateTime = new Date().getTime() + global.TimeDelta
            
    //send read reciept if activechat            
    if(!incomingMessage.IS_GROUP_MSG){

        // sending delivery receipt
        var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
            .c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })
            connection.send(received.tree(), () => {
            db.updateDeliveryAndReadRecipt('Delivery', _id, createdDateTime).then(()=>{
                console.log('Delivery Success')
            }).catch(err => {
                console.log('Delivery Error')
            });
        }); 

        // if active chat send read receipt
        if (getState().chatslist.activeChat.JID == incomingMessage.CHAT_ROOM_JID) {	                    

            var read = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
                .c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID })
                connection.send(read.tree(), () => {
                db.updateDeliveryAndReadRecipt('Read', _id, createdDateTime).then(()=>{
                    console.log('Read Success')
                }).catch(err => {
                    console.log('Read Error')
                });
            });                   
                

        }
    
    } 

}


