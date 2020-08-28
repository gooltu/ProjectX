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
    for (let i = 0; i < Contacts.length; i++) {
        if (Contacts[i].phoneNumbers.length > 0) {
            let data = new phoneContactModal(Contacts[i])
            if (data.CONTACT_NUMBER.length == 12) {
                var from = data.CONTACT_NUMBER + '@jewelchat.net'
                db.checkIfRowExist(from).then(result => {
                    if (result.rows.length > 0) {
                        var contact = result.rows.item(0)
                        console.log(contact)
                        if (contact.IS_PHONEBOOK_CONTACT != 1) {
                            db.updatePhoneContact(data).then(res => {
                                console.log(from, contact.JID)
                                store.dispatch(sendSubscriptionRequest(from))
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
                    if (i == Contacts.length - 1) {
                        callback()
                    }
                })
            }
        }
    }
}


export const renderJewel = (id, width, height, style) => {
    let jewelView
    if (id == 0)
        jewelView = <Diamond width={width} height={height} style={style} />
    if (id == 1)
        jewelView = <Coin width={width} height={height} style={style} />
    if (id == 3)
        jewelView = <J3 width={width} height={height} style={style} />
    if (id == 4)
        jewelView = <J4 width={width} height={height} style={style} />
    if (id == 5)
        jewelView = <J5 width={width} height={height} style={style} />
    if (id == 6)
        jewelView = <J6 width={width} height={height} style={style} />
    if (id == 7)
        jewelView = <J7 width={width} height={height} style={style} />
    if (id == 8)
        jewelView = <J8 width={width} height={height} style={style} />
    if (id == 9)
        jewelView = <J9 width={width} height={height} style={style} />
    if (id == 10)
        jewelView = <J10 width={width} height={height} style={style} />
    if (id == 11)
        jewelView = <J11 width={width} height={height} style={style} />
    if (id == 12)
        jewelView = <J12 width={width} height={height} style={style} />
    if (id == 13)
        jewelView = <J13 width={width} height={height} style={style} />
    if (id == 14)
        jewelView = <J14 width={width} height={height} style={style} />
    if (id == 15)
        jewelView = <J15 width={width} height={height} style={style} />
    if (id == 16)
        jewelView = <J16 width={width} height={height} style={style} />
    if (id == 17)
        jewelView = <J17 width={width} height={height} style={style} />


    return jewelView

}