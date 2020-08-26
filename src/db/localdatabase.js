import SQLite from 'react-native-sqlite-storage';
import SQL from './queries';
import phoneContactModal from './phoneContactModal';


SQLite.DEBUG(true);
SQLite.enablePromise(true);

let _jcdb

export default {
	getChats, getChatList, updatePhoneContact, insertStropheChatData, updateDeliveryAndReadRecipt, getContactList, updatePickedJewel,
	updateLastMessageAndText, selectUnreadMessages, selectUnsendMessages, updateContact, insertContactData, checkIfRowExist, insertTeamJC
};

SQLite.openDatabase({
	name: 'jewelchat.db',
	version: '1.0'
}).then(instance => {
	_jcdb = instance;
	console.log('APP START DATABASE CONNECTION SUCCESSFUL');
	console.log(_jcdb)
	return _jcdb.transaction((txn) => {

		let queries = [];

		let q = txn.executeSql(SQL.Create_Contact);
		queries.push(q);

		q = txn.executeSql(SQL.Create_ChatMessage)
		queries.push(q);

		q = txn.executeSql(SQL.Sequence_Trigger)
		queries.push(q);
		return Promise.all(queries);
	})

}).then(val => {
	console.log('APP START CREATE TABLES PROMISE SUCCESSFUL')
	console.log(val)
}).then((result) => {
	console.log('APP START TRANSACTION SUCCESSFUL')
}).catch(err => {
	console.log('APP START DATABASE ERROR');
	console.log(err);
	//kill app
});


function _initDb() {
	return new Promise((resolve, reject) => {
		if (_jcdb)
			resolve(_jcdb);
		else {
			SQLite.openDatabase({
				name: 'jewelchat.db',
				version: '1.0'
			}).then(instance => {
				_jcdb = instance;
				resolve(_jcdb);
			}).catch(err => {
				reject(err);
			})
		}
	})
}

function getChats(JID, offset) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				txn.executeSql('select * FROM ChatMessage JOIN (select MAX(SEQUENCE) as MAX_SEQUENCE from ChatMessage) where CHAT_ROOM_JID ="' + JID + '" ORDER BY _ID DESC LIMIT 20 OFFSET ' + offset)
					.then((results) => {
						console.log('QUERY COMPLETED for Chat room', JID);
						console.log(results[1])
						resolve(results[1])
					})
					.catch(err => {
						reject(err)
					})
			})
		}).then(result => {
		}).catch(err => {
			reject(err)
		})
	});
}

function getChatList() {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				txn.executeSql('Select * from Contact WHERE LAST_MSG_CREATED_TIME IS NOT NULL ORDER BY LAST_MSG_CREATED_TIME DESC')
					.then((results) => {
						console.log('Contact query COMPLETED for');
						console.log(results[1])
						resolve(results[1])
					})
					.catch(err => {
						reject(err)
					})
			})
		}).then(result => {
		}).catch(err => {
			reject(err)
		})
	});
}

function getContactList(type) {
	let Query
	if (type == 'Forward')
		Query = 'Select * from Contact where IS_REGIS=1'
	else
		Query = 'Select * from Contact where IS_PHONEBOOK_CONTACT=1'

	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				txn.executeSql(Query)
					.then((results) => {
						console.log('Contact query COMPLETED for');
						console.log(results[1])
						resolve(results[1])
					})
					.catch(err => {
						reject(err)
					})
			})
		}).then(result => {
		}).catch(err => {
			reject(err)
		})
	});
}

function checkIfRowExist(JID) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				txn.executeSql('Select * from Contact where JID="' + JID + '"')
					.then((results) => {
						console.log('Contact query COMPLETED for');
						console.log(results[1])
						resolve(results[1])
					})
					.catch(err => {
						reject(err)
					})
			})
		}).then(result => {
		}).catch(err => {
			reject(err)
		})
	});
}


function insertStropheChatData(data) {
	//select last_insert_rowid()
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				sql = "INSERT INTO ChatMessage " +
					" ( MSG_TYPE, CREATED_DATE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, JEWEL_TYPE, MSG_TEXT, SENDER_MSG_ID, IS_REPLY, IS_FORWARD, REPLY_PARENT) " +
					" VALUES (" + data.MSG_TYPE + ",'" + data.CREATED_DATE + "','" + data.CREATED_TIME + "','" + data.CHAT_ROOM_JID + "','" + data.CREATOR_JID + "'," + data.JEWEL_TYPE + ",'" + data.MSG_TEXT + "'," + data.SENDER_MSG_ID + "," + data.IS_REPLY + "," + data.IS_FORWARD + ",'" + data.REPLY_PARENT + "')"
				console.log(sql)
				txn.executeSql(sql).then((results) => {
					console.log('ChatMessage insert Query COMPLETED for');
					console.log(results[1].insertId)
					resolve(results[1].insertId)
				}).catch(err => {
					reject(err)
				})
			})
		}).then(result => {
		}).catch(error => {
			reject(error)
		})
	})
}

function updatePickedJewel(id) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				sql = "UPDATE ChatMessage SET IS_JEWEL_PICKED = 1  WHERE _ID =  " + id
				console.log(sql)
				txn.executeSql(sql).then((results) => {
					console.log('Chat updated for picked Jewel');
					resolve('success')
				}).catch(err => {
					reject(err)
				})
			})
		}).then(result => {
		}).catch(error => {
			reject(error)
		})
	})
}

function updateDeliveryAndReadRecipt(type, id, time) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				if (type == 'Delivery') {
					sql = "UPDATE ChatMessage SET IS_DELIVERED = 1, TIME_DELIVERED = " + time + " WHERE _ID =  " + id
					txn.executeSql(sql).then((results) => {
						console.log('ChatMessage Delivered Query COMPLETED for id, ', id);
						resolve('success')
					}).catch(err => {
						reject(err)
					})
				}
				else if (type == 'Both') {
					sql = "UPDATE ChatMessage SET IS_READ = 1,TIME_READ=" + time + ", IS_DELIVERED = 1, TIME_DELIVERED = " + time + "  WHERE _ID =  " + id
					txn.executeSql(sql).then((results) => {
						console.log('ChatMessage Read Query COMPLETED for id, ', id);
						resolve('success')
					}).catch(err => {
						reject(err)
					})
				}
				else if (type == 'Read') {
					sql = "UPDATE ChatMessage SET IS_READ = 1,TIME_READ=" + time + " WHERE _ID = " + id
					txn.executeSql(sql).then((results) => {
						console.log('ChatMessage Delivered Query COMPLETED for id, ', id);
						resolve('success')
					}).catch(err => {
						reject(err)
					})
				}
				else if (type == 'Submit') {
					sql = "UPDATE ChatMessage SET IS_SUBMITTED = 1,TIME_SUBMITTED=" + time + " WHERE _ID = " + id
					txn.executeSql(sql).then((results) => {
						console.log('ChatMessage Delivered Query COMPLETED for id, ', id);
						resolve('success')
					}).catch(err => {
						reject(err)
					})
				}
			}).then(result => {

			}).catch(error => {
				reject(error)
			})
		})
	})
}

function selectUnreadMessages(JID) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				sql = "SELECT * FROM ChatMessage WHERE CHAT_ROOM_JID ='" + JID + "' AND CREATOR_JID='" + JID + "' AND IS_READ = 0"
				console.log(sql)
				txn.executeSql(sql).then((results) => {
					console.log('Unread messages Query COMPLETED for');
					console.log(results[1])
					resolve(results[1])
				}).catch(err => {
					reject(err)
				})
			})
		}).then(result => {
		}).catch(error => {
			reject(error)
		})
	})
}

function selectUnsendMessages(JID) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				sql = "SELECT * FROM ChatMessage WHERE CREATOR_JID='" + JID + "' AND IS_SUBMITTED = 0"
				console.log(sql)
				txn.executeSql(sql).then((results) => {
					console.log('Unsend messages Query COMPLETED for');
					console.log(results[1])
					resolve(results[1])
				}).catch(err => {
					reject(err)
				})
			})
		}).then(result => {
		}).catch(error => {
			reject(error)
		})
	})
}

function updateLastMessageAndText(message, createdDateTime, messageType) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql;
				if (messageType == 'Active') {
					sql = "UPDATE Contact SET LAST_MSG_CREATED_TIME =" + createdDateTime + ", MSG_TEXT = '" + message.MSG_TEXT + "', MSG_TYPE= " + message.MSG_TYPE + ", UNREAD_COUNT = " + 0 + " WHERE JID = '" + message.CHAT_ROOM_JID + "'"
				}
				else {
					sql = "UPDATE Contact SET LAST_MSG_CREATED_TIME =" + createdDateTime + ", MSG_TEXT = '" + message.MSG_TEXT + "', MSG_TYPE= " + message.MSG_TYPE + ", UNREAD_COUNT = UNREAD_COUNT +" + 1 + " WHERE JID = '" + message.CHAT_ROOM_JID + "'"
				}
				txn.executeSql(sql).then((results) => {
					console.log('ChatMessage contact update Query COMPLETED for id, ');
					resolve('success')
				}).catch(err => {
					reject(err)
				})
			})
		}).then(result => {

		}).catch(error => {
			reject(error)
		})
	})
}


function insertContactData(data) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql = "INSERT INTO Contact " +
					" (JID, CONTACT_NUMBER, IS_PHONEBOOK_CONTACT , PHONEBOOK_CONTACT_NAME, IS_REGIS) " +
					" VALUES (" + _handleString(data.JID) + "," + _handleString(data.CONTACT_NUMBER) + ", " + data.IS_PHONEBOOK_CONTACT + "," + _handleString(data.PHONEBOOK_CONTACT_NAME) + "," + data.IS_REGIS + ") "
				txn.executeSql(sql).then(val => {
					resolve('Success')
				}).catch(err => {
					console.log('reject')
					reject(err)
				})
			}).catch(err => {
				console.log('reject1')
				reject(err)
			})
		})
	})
}

function updatePhoneContact(contactData) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql = "UPDATE Contact SET PHONEBOOK_CONTACT_NAME=" + _handleString(contactData.PHONEBOOK_CONTACT_NAME) + ", IS_PHONEBOOK_CONTACT = 1  WHERE CONTACT_NUMBER=" + contactData.CONTACT_NUMBER;
				txn.executeSql(sql).then(result => {
					resolve('success')
					console.log('success Contact update')
				}).catch(err => {
					reject('fail')
					console.log('fail Contact update')
				})
			}).catch(err => {
				reject('fail')
				console.log('fail Contact update')
			})
		})
	})
}

function updateContact(contactData) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql = "UPDATE Contact SET JEWELCHAT_ID = " + contactData.id + ", SMALL_IMAGE=" + _handleString(contactData.pic) + ", IMAGE_PATH=" + _handleString(contactData.large_pic) + "," +
					"CONTACT_NAME=" + _handleString(contactData.name) + ",STATUS_MSG=" + _handleString(contactData.status) + ", IS_INVITED=" + contactData.invited + ", IS_REGIS=" + contactData.regis + " WHERE CONTACT_NUMBER=" + contactData.phone;
				txn.executeSql(sql).then(result => {
					resolve('success')
					console.log('success Contact update')
				}).catch(err => {
					reject('fail')
					console.log('fail Contact update')
				})
			}).catch(err => {
				reject('fail')
				console.log('fail Contact update')
			})
		})
	})
}

function _handleString(value) {
	if (value == 'null' || value == 'undefined' || value == null || value == '') {
		return null
	}
	else
		return "'" + value + "'"
}

function insertTeamJC(data) {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let sql = "INSERT INTO Contact " +
					" (JID, CONTACT_NUMBER, IS_PHONEBOOK_CONTACT , PHONEBOOK_CONTACT_NAME, IS_REGIS, LAST_MSG_CREATED_TIME, SMALL_IMAGE, IMAGE_PATH, CHAT_ROOM_JID) " +
					" VALUES (" + _handleString(data.JID) + "," + _handleString(data.CONTACT_NUMBER) + ", " + data.IS_PHONEBOOK_CONTACT + "," + _handleString(data.PHONEBOOK_CONTACT_NAME) + "," + data.IS_REGIS + "," + data.LAST_MSG_CREATED_TIME + "," + data.SMALL_IMAGE + ",'" + _handleString(data.IMAGE_PATH) + "," + _handleString(data.JID) + " ) "
				txn.executeSql(sql).then(val => {
					resolve('Success')
				}).catch(err => {
					console.log('reject')
					reject(err)
				})
			}).catch(err => {
				console.log('reject1')
				reject(err)
			})
		})
	})
}

const contactData = [
	{
		_ID: 1,
		JEWELCHAT_ID: 1,
		JID: '2@jewelchat.net',
		CONTACT_NUMBER: 919700000000,
		CONTACT_NAME: 'Team JewelChat',
		PHONEBOOK_CONTACT_NAME: 'Team JewelChat',
		IS_GROUP: 0,
		STATUS_MSG: 'Keep Collecting',
		IS_REGIS: 1,
		IS_GROUP_ADMIN: 0,
		IS_INVITED: null,
		IS_BLOCKED: 0,
		IS_PHONEBOOK_CONTACT: 0,
		UNREAD_COUNT: 0,
		SMALL_IMAGE: null,
		IMAGE_PATH: 'https://parthaprofiles.s3.ap-south-1.amazonaws.com/9005835708_pic.png',
		LAST_MSG_CREATED_TIME: '1569819266669',
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World'
	},
]

const chatList = [
	{
		_ID: 1,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-14',
		CREATED_TIME: '16:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 2,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-14',
		CREATED_TIME: '14:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 3,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-14',
		CREATED_TIME: '12:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 4,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-13',
		CREATED_TIME: '16:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 5,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-13',
		CREATED_TIME: '14:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 6,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-13',
		CREATED_TIME: '12:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 7,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835709@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-13',
		CREATED_TIME: '10:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 8,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World',
		CREATED_DATE: '2020-01-12',
		CREATED_TIME: '12:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 9,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835708@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World Well organized and easy to understand Web building tutorials with lots of examples',
		CREATED_DATE: '2020-01-12',
		CREATED_TIME: '10:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	},
	{
		_ID: 10,
		CHAT_ROOM_JID: '919005835708@jewelchat.net',
		CREATOR_JID: '919005835709@jewelchat.net',
		SENDER_NAME: 'mayukh',
		SENDER_MSG_ID: 1,
		IS_GROUP_MSG: 0,
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World ',
		CREATED_DATE: '2020-01-12',
		CREATED_TIME: '08:00:00',
		JEWEL_TYPE: 3,
		IS_JEWEL_PICKED: 0,
		IS_SUBMITTED: 1,
		TIME_SUBMITTED: '',
		IS_READ: 0,
		TIME_READ: '',
		IS_DELIVERED: 0,
		TIME_DELIVERED: '',
		IS_ERROR: 0,
		IMAGE_BLOB: null,
		IS_IMAGE_DOWNLOADED: 0,
		IS_IMAGE_UPLOADED: 0,
		IMAGE_PATH_LOCAL: null,
		IMAGE_PATH_CLOUD: null,
		VIDEO_BLOB: null,
		IS_VIDEO_DOWNLOADED: 0,
		IS_VIDEO_UPLOADED: 0,
		VIDEO_PATH_LOCAL: null,
		VIDEO_PATH_CLOUD: null
	}
]


// export default {
//   jcdb,
//   openDatabaseConnection,
//   createDatabaseTables
// }

/*
export const initLocalDatabase = () => {

    return (dispatch, getState) => {

        //console.log('GET STATE');
        //console.log(getState());

        dispatch({ type: 'INIT_DATABASE_START' })

        SQLite.openDatabase({
            name: 'jewelchat.db',
            version: '1.0'
        })
        .then(instance => {

            jcdb = instance;

            jcdb.transaction((txn) => {
                console.log('SQL')
                console.log(SQL.Create_Contact)

                let queries = [];

                let q = txn.executeSql(SQL.Create_Contact);
                queries.push(q);

                q = txn.executeSql(SQL.Create_ChatMessage);
                queries.push(q);

                Promise.all(queries).then( val => {
                    console.log('PROMISE ALL')
                    console.log(val)
                    dispatch({ type: 'INIT_DATABASE_DONE', payload: { dbInit: 'DONE' } })
                }).catch( err => {
                    throw err;
                })


            }).then((result) =>{
              console.log('Result:'+ result);
            }).catch((err) => {
                throw err;
            })



        })
        .catch( err => {
            dispatch({ type: 'INIT_DATABASE_ERROR', payload: { dbInit: 'FAILED' } })
        });

    }


}



function listProduct() {
    return new Promise((resolve) => {
        const products = [];
        this.initDB().then((db) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT p.prodId, p.prodName, p.prodImage FROM Product p', []).then(([tx, results]) => {
                    console.log("Query completed");
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        console.log(`Prod ID: ${row.prodId}, Prod Name: ${row.prodName}`)
                        const { prodId, prodName, prodImage } = row;
                        products.push({
                            prodId,
                            prodName,
                            prodImage
                        });
                    }
                    console.log(products);
                    resolve(products);
                });
            }).then((result) => {
                this.closeDatabase(db);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

*/