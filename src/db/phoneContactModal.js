export default class phoneContactModal {
    "_ID" = ''
    "JEWELCHAT_ID" = ''
    "JID" = ''
    "CONTACT_NUMBER" = ''
    "CONTACT_NAME" = ''
    "PHONEBOOK_CONTACT_NAME" = ''
    "IS_GROUP" = ''
    "STATUS_MSG" = ''
    "IS_REGIS" = ''
    "IS_GROUP_ADMIN" = ''
    "IS_INVITED" = ''
    "IS_BLOCKED" = ''
    "IS_PHONEBOOK_CONTACT" = ''
    "UNREAD_COUNT" = ''
    "LAST_MSG_CREATED_TIME" = ''
    "MSG_TYPE" = ''
    "MSG_TEXT" = ''
    "SMALL_IMAGE" = ''
    "IMAGE_PATH" = ''

    constructor(jsonObj){
        this.PHONEBOOK_CONTACT_NAME = jsonObj.givenName +" "+ jsonObj.middleName +" "+ jsonObj.familyName
        this.CONTACT_NUMBER = jsonObj.phoneNumbers[0].number
        this.JID = jsonObj.phoneNumbers[0].number + '@jewelchat.net'
        this.IS_PHONEBOOK_CONTACT = 1
    }
}