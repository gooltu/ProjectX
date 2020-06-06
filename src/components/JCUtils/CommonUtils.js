import React from 'react'
import store from '../../store'
import Contacts from 'react-native-contacts'
import db from '../../db/localdatabase'
import { Platform, PermissionsAndroid } from "react-native";
import phoneContactModal from '../../db/phoneContactModal'
import J6 from '../svg_components/J6'
import J3 from '../svg_components/J3'
import J9 from '../svg_components/J9'
import J12 from '../svg_components/J12'
import J15 from '../svg_components/J15'

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
            getAllContacts(callback)
        })
    }
    else {
        getAllContacts(callback)
    }
}

function getAllContacts(callback) {
    Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
            // Alert.alert("Error", err)
        } else {
            console.log('contacts', contacts)
            global.Contacts = contacts
            insertContacts(contacts, callback)
        }
    })
}

function insertContacts(Contacts, callback) {
    console.log('callback')
    console.log(callback)
    for (let i = 0; i < Contacts.length; i++) {
        console.log(Contacts[i])
        // console.log(new phoneContactModal(Contacts[i]))
        if (Contacts[i].phoneNumbers.length > 0) {
            let data = new phoneContactModal(Contacts[i])
            if (data.CONTACT_NUMBER.length == 12) {
                var from = data.CONTACT_NUMBER + '@jewelchat.net'
                db.checkIfRowExist(from).then(result => {
                    if (i == Contacts.length - 1) {
                        callback()
                    }
                    if (result.rows.length > 0) {
                        var contact = result.rows.item(0)
                        if (contact.IS_PHONEBOOK_CONTACT != 1) {
                            db.updatePhoneContact(data).then(res => {
                                store.dispatch(sendSubscriptionRequest(result.JID))

                            }).catch(err => {

                            })
                        }
                    }
                    else {
                        db.insertContactData(data).then(res => {
                            if (i == Contacts.length - 1) {
                                callback()
                            }
                        }).catch(err => {

                        })
                    }
                })
            }
        }
    }
}


export const renderJewel = (id, width, height, style) => {
    let jewelView = <J15 width={width} height={height} style={style} />
    if (id == 3 || id == 4 || id == 5)
        jewelView = <J3 width={width} height={height} style={style} />
    if (id == 6 || id == 7 || id == 8)
        jewelView = <J6 width={width} height={height} style={style} />
    if (id == 9 || id == 10 || id == 11)
        jewelView = <J9 width={width} height={height} style={style} />
    if (id == 12 || id == 13 || id == 14)
        jewelView = <J12 width={width} height={height} style={style} />
    if (id == 15 || id == 16 || id == 17)
        jewelView = <J15 width={width} height={height} style={style} />


    return jewelView

}