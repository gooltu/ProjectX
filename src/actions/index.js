import { setActiveChat, setChatListData, setPresence } from './chatListActions'
import { setChatData, addChatMessage } from './chatRoomActions'
import { loadGameState, setTaskData, setTaskDetails, setGiftTaskData, setLeaderBoard, setGiftTaskDetails, setUserGiftTask } from './GameActions'
import { setAchievements, setUserAchievement } from './AchievementActions'
import { getFactory, getUserFactory } from './FactoryActions'
export default {
     setActiveChat, setChatListData, setChatData,
     addChatMessage, setPresence, loadGameState, setTaskData,
     setTaskDetails, setGiftTaskData, setGiftTaskDetails, setUserGiftTask,
     setAchievements, setUserAchievement, setLeaderBoard, getFactory, getUserFactory
}