import store from '../../store'
import Contacts from 'react-native-contacts'
import db from '../../db/localdatabase'
import { Platform, PermissionsAndroid } from "react-native";
import phoneContactModal from '../../db/phoneContactModal'

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