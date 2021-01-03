import {getConnectionObj} from './realtimeobj';
import actions from '../../actions';

export const handlePresence = (msg) => {

    return (dispatch, getState) => {

        var type = msg.getAttribute('type')
        var from = msg.getAttribute('from').split('/')[0]
        var to = msg.getAttribute('to').split('/')[0]
        console.log(type)
        console.log(from)
        console.log(to)
        getConnectionObj().roster.add('7@jewelchat.net', 'nickname', [], function () { })
        if ((type == '' || type == 'unavailable') && from != to) {
            let presenceData = JSON.parse(JSON.stringify(getState().chatslist.presence))
            if (type == 'unavailable')
                presenceData[from] = 'offline'
            else
                presenceData[from] = 'online'
            dispatch(actions.setPresence(presenceData))
        }
        else if (type == 'subscribe') {
            db.checkIfRowExist(from).then(result => {
                if (result.rows.length > 0) {
                    var contact = result.rows.item(0)
                    if (contact.IS_PHONEBOOK_CONTACT == 1) {
                        getConnectionObj().roster.authorize(from)
                    }
                }
                else {
                    getConnectionObj().roster.unauthorize(from)
                }
            })
        }
        else if (type == 'subscribed') {
            getConnectionObj().roster.authorize(from)
        }

    }    
}