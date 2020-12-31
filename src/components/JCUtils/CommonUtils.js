import React from 'react'
import { store } from '../../store'
import Contacts from 'react-native-contacts'
import db from '../../db/localdatabase'
import { Platform, PermissionsAndroid } from "react-native";
import phoneContactModal from '../../db/phoneContactModal'
import J3 from '../svg_components/J3'
import J4 from '../svg_components/J4'
import J5 from '../svg_components/J5'
import J6 from '../svg_components/J6'
import J7 from '../svg_components/J7'
import J8 from '../svg_components/J8'
import J9 from '../svg_components/J9'
import J10 from '../svg_components/J10'
import J11 from '../svg_components/J11'
import J12 from '../svg_components/J12'
import J13 from '../svg_components/J13'
import J14 from '../svg_components/J14'
import J15 from '../svg_components/J15'
import J16 from '../svg_components/J16'
import J17 from '../svg_components/J17'
import Diamond from '../svg_components/Diamond'
import Coin from '../svg_components/Coin'
import { sendSubscriptionRequest } from '../../network/realtime'

export const getContacts = (callback) => {
    if (Platform.OS == 'android') {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.',
                'buttonPositive': 'Please accept bare mortal'
            }
        ).then(() => {
            getAllContactsAndroid(callback)
        })
    }
    else {
        getAllContactsIOS(callback)
    }
}

function getAllContactsAndroid(callback) {
    Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
            // Alert.alert("Error", err)
        } else {
            console.log('contacts', contacts)            
            insertContacts(contacts, callback)
        }
    })
}

function getAllContactsIOS(callback) {
    callback();
}


function insertContacts(Contacts, callback) {

    let p = [];
    const regex1 = /\D/g;
    const regex2 = /^0+/g;
    const regex3 = /^91+/g;

    //return '91' + number.replaceAll(regex1,'').replace(regex2,'');

    for (let i = 0; i < Contacts.length; i++) {
        for( let j=0; j < Contacts[i].phoneNumbers.length; j++) {       
                
                let n = Contacts[i].phoneNumbers[j].number.toString().split(regex1).join('').split(regex2).join('');  
                let ph;            
                if(n.length == 10 )
                    ph = '91' + n;
                else if(n.length == 12 && n.substring(0,2) === '91')
                    ph = n;  
                else 
                    break;      
                console.log('CONTACT LIST', ph);
                let data = {
                    PHONEBOOK_CONTACT_NAME : Contacts[i].givenName + " " + Contacts[i].middleName + " " + Contacts[i].familyName,
                    CONTACT_NUMBER : ph,
                    JID : ph + '@jewelchat.net',
                    IS_PHONEBOOK_CONTACT : 1,
                    IS_REGIS : 0,
                    IS_INVITED : 0
                }
                if (data.CONTACT_NUMBER.length == 12) {
                    p.push(db.insertContactData(data))
                }

        }
    }

    Promise.all(p)
    .then((val) => {
        console.log('CONTACT INSERT SUCCESS', val )
        callback()
    })
    .catch(err => {
        console.log('CONTACT INSERT ERR', err )
        callback()
    })
}


// function insertContacts(Contacts, callback) {
//     for (let i = 0; i < Contacts.length; i++) {
//         if (Contacts[i].phoneNumbers.length > 0) {
//             let data = new phoneContactModal(Contacts[i])
//             if (data.CONTACT_NUMBER.length == 12) {
//                 var from = data.CONTACT_NUMBER + '@jewelchat.net'
//                 db.checkIfRowExist(from).then(result => {
//                     if (result.rows.length > 0) {
//                         var contact = result.rows.item(0)
//                         console.log(contact)
//                         if (contact.IS_PHONEBOOK_CONTACT != 1) {
//                             db.updatePhoneContact(data).then(res => {
//                                 console.log(from, contact.JID)
//                                 store.dispatch(sendSubscriptionRequest(from))
//                             }).catch(err => {})
//                         }
//                     }
//                     else {
//                         db.insertContactData(data).then(res => {
//                             if (i == Contacts.length - 1) {
//                                 callback()
//                             }
//                         }).catch(err => {

//                         })
//                     }
//                     if (i == Contacts.length - 1) {
//                         callback()
//                     }
//                 })
//             }
//         }
//     }
// }


export const renderJewel = (id, width, height, style, key) => {
    let jewelView
    if (id == 0)
        jewelView = <Diamond width={width} height={height} style={style} key={key} />
    if (id == 1)
        jewelView = <Coin width={width} height={height} style={style}  key={key} />
    if (id == 3)
        jewelView = <J3 width={width} height={height} style={style}  key={key} />
    if (id == 4)
        jewelView = <J4 width={width} height={height} style={style}  key={key} />
    if (id == 5)
        jewelView = <J5 width={width} height={height} style={style} key={key} />
    if (id == 6)
        jewelView = <J6 width={width} height={height} style={style} key={key} />
    if (id == 7)
        jewelView = <J7 width={width} height={height} style={style} key={key} />
    if (id == 8)
        jewelView = <J8 width={width} height={height} style={style} key={key} />
    if (id == 9)
        jewelView = <J9 width={width} height={height} style={style} key={key} />
    if (id == 10)
        jewelView = <J10 width={width} height={height} style={style} key={key} />
    if (id == 11)
        jewelView = <J11 width={width} height={height} style={style} key={key} />
    if (id == 12)
        jewelView = <J12 width={width} height={height} style={style} key={key} />
    if (id == 13)
        jewelView = <J13 width={width} height={height} style={style} key={key} />
    if (id == 14)
        jewelView = <J14 width={width} height={height} style={style} key={key} />
    if (id == 15)
        jewelView = <J15 width={width} height={height} style={style} key={key} />
    if (id == 16)
        jewelView = <J16 width={width} height={height} style={style} key={key} />
    if (id == 17)
        jewelView = <J17 width={width} height={height} style={style} key={key} />


    return jewelView

}