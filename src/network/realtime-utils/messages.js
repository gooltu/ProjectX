import db from '../../db/localdatabase';
import {getConnectionObj} from './realtimeobj';
import actions from '../../actions'

// function to handlle incoming messages (insertion to DB , sending delivery and read receipt)
export const insertIncomingMessageViaHistoryDownload = (incomingMessage) => {
	return (dispatch, getState) => {
        if(incomingMessage.CREATOR_JID.split('@')[0] !== getState().mytoken.myphone){
            db.insertStropheChatData(incomingMessage).then((_id) => {

                if(incomingMessage.IS_GROUP_MSG != 1){
                    incomingMessage['_ID'] = _id
                    //let activechat_jid = getState().activeChat.JID;  
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
                    //let activechat_jid = getState().activeChat.JID;   
                    //console.log('OMGOMGOMG', activechat_jid)  
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


export const sendOutgoingMessage = (outgoingMessage) => {

	return new Promise((resolve, reject) => {

        let reply;

        if(outgoingMessage.IS_GROUP_MSG == 0 || outgoingMessage.IS_GROUP_MSG == null){
            if(outgoingMessage.MSG_TYPE == 0){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID , from: outgoingMessage.CREATOR_JID, type: 'chat', id: outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', outgoingMessage.MSG_TEXT))
                        .up()
                        .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
                
                
            }else if(outgoingMessage.MSG_TYPE == 1){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'chat', id: outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Image'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD})
                        .up()
                        .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
                
            }else if(outgoingMessage.MSG_TYPE == 2){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'chat', id: outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Video'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD , thumbnail: outgoingMessage.MEDIA_CLOUD_THUMBNAIL})
                        .up()
                        .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
                
            }else if(outgoingMessage.MSG_TYPE == 3){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'chat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'GIF'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD })
                        .up()
                        .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});

                
            }else if(outgoingMessage.MSG_TYPE == 4){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'chat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Sticker'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD})
                        .up()
                        .c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
                
            }

        }
        else if(outgoingMessage.IS_GROUP_MSG == 1){

            if(outgoingMessage.MSG_TYPE == 0){

                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID , from: outgoingMessage.CREATOR_JID, type: 'groupchat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', outgoingMessage.MSG_TEXT));
                
            }else if(outgoingMessage.MSG_TYPE == 1){
                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'groupchat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Image'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD})
                
            }else if(outgoingMessage.MSG_TYPE == 2){
                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'groupchat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Video'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD , thumbnail: outgoingMessage.MEDIA_CLOUD_THUMBNAIL})
                
            }else if(outgoingMessage.MSG_TYPE == 3){
                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'groupchat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'GIF'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD })
                
            }else if(outgoingMessage.MSG_TYPE == 4){
                reply = $msg({to: outgoingMessage.CHAT_ROOM_JID, from: outgoingMessage.CREATOR_JID, type: 'groupchat', id:outgoingMessage.SENDER_MSG_ID })
                        .cnode(Strophe.xmlElement('body', 'Sticker'))              
                        .up()
                        .c('media', {number:outgoingMessage.MSG_TYPE, link:outgoingMessage.MEDIA_CLOUD})
            }

        }


        try{

            getConnectionObj().send(reply.tree(), () => {
                resolve('Success')
            })

        }catch(err){
            reject(err)
        }            


    })
}


function _sendReceiptsOnReceivingMessages(incomingMessage, getState){    
    console.log('SEND RECEIPTS')
    var createdDateTime = new Date().getTime() + global.TimeDelta
            
    //send read reciept if activechat            
    if(!incomingMessage.IS_GROUP_MSG){

        // sending delivery receipt
        var received = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
            .c('received', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID });

        getConnectionObj().send(received.tree(), () => {
            console.log('UPDATE DATABASE');    
            db.updateDeliveryAndReadReceipt('Delivery', incomingMessage._ID, createdDateTime).then(()=>{
                console.log('Delivery Success')
            }).catch(err => {
                console.log('Delivery Error')
            });

        }); 
        
        
        if (getState().activechat.JID === incomingMessage.CHAT_ROOM_JID) {	                    
            console.log('SEND READ RECEIPT');
            var read = $msg({ to: incomingMessage.CHAT_ROOM_JID, from: getState().mytoken.myphone + '@jewelchat.net' })
                .c('read', { xmlns: 'urn:xmpp:chat-markers:0', id: incomingMessage.SENDER_MSG_ID });

            getConnectionObj().send(read.tree(), () => {
                console.log('READ RECEIPT SENT')
                db.updateDeliveryAndReadReceipt('Read', incomingMessage._ID, createdDateTime).then(()=>{
                    console.log('Read Success')
                }).catch(err => {
                    console.log('Read Error')
                });
            });                   
                

        }
    
    } 

}


