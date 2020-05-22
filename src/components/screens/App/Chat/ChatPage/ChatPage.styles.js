import { StyleSheet, PixelRatio } from 'react-native'

import colors from '../../../../shared_styles/colors'
export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.darkcolor3
    },
    subContainer: {
        flex: 1,
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        backgroundColor: colors.darkcolor3,
    },
    chatroom: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: colors.darkcolor1,
        overflow: 'scroll',
        paddingLeft: 8,
        paddingRight: 8
    },
    createdDateStyle: {
        marginTop: 5,
        marginBottom: 5,
        color: 'white',
        alignSelf: 'center'
    },
    chatItemContainer: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 8
    },
    mainBarConatiner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6,
        marginBottom: 6,
        alignItems: 'center'
    },
    firstItemMainBar: {
        height: 24,
        width: 24,
        backgroundColor: 'black',
        marginLeft: 8,
        marginRight: 4
    },
    secondItem: {
        height: 24,
        width: 24,
        backgroundColor: 'red',
        marginLeft: 4,
        marginRight: 4
    },
    thirdItem: {
        height: 24,
        width: 24,
        backgroundColor: 'red',
        marginLeft: 4,
        marginRight: 8
    },
    fourthItem: {
      //  backgroundColor: 'blue',
        marginLeft: 4,
        marginRight: 8
    },
    friendMsgContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10
    },
    jewelContainer: {
        width: 32,
        height: 32
    },
    jewelStyle: {
        marginHorizontal: 10,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        overflow: 'hidden'
    },
    msgContainer: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: 200
    },
    myMsgContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    friendMsgText: {
        padding: 5,
        color: 'white'
    },
    friendMsgTextContainer:{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#4287f5',
        backgroundColor: '#4287f5',
        borderRadius: 5
    },
    myMsgText: {
        padding: 5,
        color: 'white'
    },
    myMsgTextConatiner:{
        backgroundColor: colors.lightcolor2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightcolor2,
        borderRadius: 5
    },
    msgTime: {
        alignSelf: 'flex-end',
        color: 'white',
        fontSize: 10,
        paddingRight: 5
    }
})