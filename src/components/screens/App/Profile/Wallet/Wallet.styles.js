import { StyleSheet, PixelRatio } from 'react-native'

import color from '../../../../shared_styles/colors'

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: color.darkcolor1
    },
    transferOptionContainer: {
        backgroundColor: '#5a98fb',
        width: 65,
        height: 65,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionText: {
        fontSize: 11,
        color: 'white',
    },
    transferText: {
        color: 'white',
        fontSize: 15
    },
    scrollBar: {
        padding: 10,
    },
    scrollBarItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 110,
        width: 110,
        borderRadius: 5,
        backgroundColor: color.darkcolor3,
        padding: 8
    },
    itemText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600'
    },
    addMoneyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30
    },
    addMoneyText: {
        paddingHorizontal: 30,
        color: 'white',
        fontWeight: 'bold'
    },
    MoneyText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    transferMoneyContainer: {
        backgroundColor: color.darkcolor3,
        padding: 10,
        flexDirection: 'row'
    },
    transferTextContainer: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paymentOptionConatiner: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    diamondContainer: {
        paddingVertical: 3,
        backgroundColor: color.darkcolor3,
        width: '100%',
        alignItems: 'center'
    },
    buyText: {
        color: 'grey',
        fontSize: 13
    },
    itemOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }

})