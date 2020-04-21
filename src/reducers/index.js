import { combineReducers } from 'redux'
import mytoken from './mytoken'
import appstate from './appstate'
import network from './network'
import game from './game'
import tasks from './tasks'
import achievements from './achievements'
import chatslist from './chatslist'
import chatroom from './chatroom'
import contactlist from './contactlist'

export default combineReducers({
    mytoken, appstate ,network, game, chatslist, chatroom, contactlist, achievements, tasks
});