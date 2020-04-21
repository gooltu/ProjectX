import { StyleSheet,PixelRatio } from 'react-native'

import color from '../../../shared_styles/colors'
export default styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:color.darkcolor1
    },
    profileSection:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:color.darkcolor3,
        height:70
    },
    firstDiamond:{
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:color.darkcolor2,
        width:'30%',
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35
    },
    mainLeftLayout:{
        flexDirection:'column',
        justifyContent:"center",
        alignItems:'center',
        paddingLeft:25
    },
    DiamondImage:{
        height:25,
        width:20
    },
    ProfilePicture:{
        width:100,
        height:100,
        top:-15
    },
    SecondDiamond:{
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:color.darkcolor2,
        width:'30%',
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 35
    },
    mainRightLayout:{
        flexDirection:'column',
        justifyContent:"center",
        alignItems:'center',
        paddingRight:25
    },
    scrollBar:{
        padding:10,
        paddingTop:20
    },
    scrollBarItem:{
        height:100,
        width:100,
        borderRadius:5,
        backgroundColor:color.lightcolor2,
        alignItems:'center',
        justifyContent:'center'
    },
    itemImage:{
        height:45,
        width:40
    },
    itemText:{
        fontSize:11,
        color:'white',
        paddingTop:10
    }
})