import SQLite from 'react-native-sqlite-storage';
import SQL from './queries';
import phoneContactModal from './phoneContactModal';


SQLite.DEBUG(true);
SQLite.enablePromise(true);

let _jcdb

export default {
	getChats, insertInitialData, insertContactList, insertChatData, getChatList, insertPhoneContactData
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

		q = txn.executeSql(SQL.Create_ChatMessage);
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

function getChats() {
	return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				txn.executeSql('Select * from ChatMessage')
					.then((results) => {
						console.log('QUERY COMPLETED');
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
				txn.executeSql('Select * from Contact')
					.then((results) => {
						console.log('Contact query COMPLETED');
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


function insertInitialData() {
	console.log('INSERT ROWS START');
	//return (dispatch, getState) => {
	console.log('INSERT ROWS');
	_initDb().then(instance => {
		jcdb = instance;
		if (jcdb) {
			jcdb.transaction((txn) => {
				let queries = [];
				let sql;
				sql = "INSERT INTO Contact " +
					" ( JEWELCHAT_ID, JID, CONTACT_NUMBER, CONTACT_NAME, STATUS_MSG, IS_REGIS, IS_INVITED, IS_PHONEBOOK_CONTACT, UNREAD_COUNT ) " +
					" VALUES ( 1, '918700000000@jewelchat.net', '918700000000', 'Team JewelChat', 'Collect and Win', 1, 1, 0, 1 )";
				let q = txn.executeSql(sql);
				queries.push(q);


				sql = "INSERT INTO ChatMessage " +
					" ( MSG_TYPE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, SENDER_NAME, SENDER_MSG_ID, JEWEL_TYPE, MSG_TEXT ) " +
					" VALUES ( 1, 1569819057204, '918700000000@jewelchat.net', '910000000000@jewelchat.net', 'Team Jewelchat', '1', '3', 'Hello World' ) ";
				q = txn.executeSql(sql);
				queries.push(q);

				sql = "INSERT INTO ChatMessage " +
					" ( MSG_TYPE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, SENDER_NAME, SENDER_MSG_ID, JEWEL_TYPE, MSG_TEXT ) " +
					" VALUES ( 1, 1569819266669, '910000000000@jewelchat.net', '910000000000@jewelchat.net', 'Team Jewelchat', '2', '6', 'How are you?' ) ";
				q = txn.executeSql(sql);
				queries.push(q);

				Promise.all(queries).then(val => {
					console.log('INSERT DATA PROMISE ALL')
					console.log(val)
					resolve('Success')
				}).catch(err => {
					reject(err)
					throw err;
				})
			}).then((result) => {
				resolve('Success')
				console.log('Result:' + result);
			}).catch((err) => {
				reject(err)
				throw err;
			})
		}
	}).catch((err) => {
		reject(err)
		throw err;
	})
}
//}

function insertContactList() {
	//	return new Promise((resolve, reject) => {
	_initDb().then(instance => {
		jcdb = instance;
		jcdb.transaction((txn) => {
			let queries = [];
			let sql;
			let q;
			for (let i = 0; i < contactData.length; i++) {
				let data = contactData[i]
				sql = "INSERT INTO Contact " +
					" ( JEWELCHAT_ID, JID, CONTACT_NUMBER, CONTACT_NAME, STATUS_MSG, IS_REGIS, IS_INVITED, IS_PHONEBOOK_CONTACT, UNREAD_COUNT , PHONEBOOK_CONTACT_NAME, LAST_MSG_CREATED_TIME, MSG_TEXT ) " +
					" VALUES (" + data.JEWELCHAT_ID + ",'" + data.JID + "','" + data.CONTACT_NUMBER + "','" + data.CONTACT_NAME + "','" + data.STATUS_MSG + "' ," + data.IS_REGIS + " , " + data.IS_INVITED + " , " + data.IS_PHONEBOOK_CONTACT + "," + data.UNREAD_COUNT + ",'" + data.PHONEBOOK_CONTACT_NAME + "','" + data.LAST_MSG_CREATED_TIME + "','" + data.MSG_TEXT + "') "
				q = txn.executeSql(sql);
				queries.push(q);
			}
			Promise.all(queries).then(val => {
				console.log('INSERT all Contact DATA PROMISE Successful')
				console.log(val)
				//		resolve('Success')
			}).catch(err => {
				//				reject(err)
				console.log('INSERT all Contact DATA PROMISE error')
				throw err;
			})
		})
	}).then(result => {
	}).catch(err => {
		//			reject(err)
	})
	//	})
}

function insertChatData() {
	//return new Promise((resolve, reject) => {
	_initDb().then(instance => {
		jcdb = instance;
		jcdb.transaction((txn) => {
			let queries = [];
			let sql;
			let q;
			for (let i = 0; i < chatList.length; i++) {
				let data = chatList[i]
				sql = "INSERT INTO ChatMessage " +
					" ( MSG_TYPE,CREATED_DATE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, SENDER_NAME, SENDER_MSG_ID, JEWEL_TYPE, MSG_TEXT) " +
					" VALUES (" + data.MSG_TYPE + ",'" + data.CREATED_DATE + "','" + data.CREATED_TIME + "','" + data.CHAT_ROOM_JID + "','" + data.CREATOR_JID + "','" + data.SENDER_NAME + "'," + data.SENDER_MSG_ID + "," + data.JEWEL_TYPE + ",'" + data.MSG_TEXT + "')"
				console.log(sql)
				q = txn.executeSql(sql);
				queries.push(q);
			}
			Promise.all(queries).then(val => {
				console.log('INSERT all Chat Data DATA PROMISE Successful')
				console.log(val)
			}).catch(err => {
				console.log('INSERT all CHAT DATA PROMISE error')
				throw err;
			})
		})
	}).then(result => {
	}).catch(err => {
		//	reject(err)
	})
	//	})
}


function insertPhoneContactData(phoneContactData){
//	 return new Promise((resolve, reject) => {
		_initDb().then(instance => {
			jcdb = instance;
			jcdb.transaction((txn) => {
				let queries = [];
				let sql;
				let q;
				for (let i = 0; i < phoneContactData.length; i++) {
					console.log(phoneContactData[i])
					console.log(new phoneContactModal(phoneContactData[i]))
					let data = new phoneContactModal(phoneContactData[i])
					sql = "INSERT INTO Contact " +
						" (JID, CONTACT_NUMBER, CONTACT_NAME, IS_PHONEBOOK_CONTACT , PHONEBOOK_CONTACT_NAME) " +
						" VALUES ('" + data.JID + "','" + data.CONTACT_NUMBER + "','" + data.PHONEBOOK_CONTACT_NAME + "', " + data.IS_PHONEBOOK_CONTACT + ",'" + data.PHONEBOOK_CONTACT_NAME + "') "
					q = txn.executeSql(sql);
					queries.push(q);
				}
				Promise.all(queries).then(val => {
					console.log('INSERT all phone Contact DATA PROMISE Successful')
					console.log(val)
					//		resolve('Success')
				}).catch(err => {
					//				reject(err)
					console.log('INSERT all Contact DATA PROMISE error')
					throw err;
				})
			})
		}).then(result => {
		}).catch(err => {
			//			reject(err)
		})
	// })
}


const contactData = [
	{
		_ID: 1,
		JEWELCHAT_ID: 1,
		JID: '919700000000@jewelchat.net',
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
		UNREAD_COUNT: 2,
		SMALL_IMAGE: null,
		IMAGE_PATH: 'https://parthaprofiles.s3.ap-south-1.amazonaws.com/9005835708_pic.png',
		LAST_MSG_CREATED_TIME: '1569819266669',
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World'
	},
	{
		_ID: 2,
		JEWELCHAT_ID: 2,
		JID: '919005835708@jewelchat.net',
		CONTACT_NUMBER: 919005835708,
		CONTACT_NAME: 'Mayukh',
		PHONEBOOK_CONTACT_NAME: 'Mayukh Chakraborty',
		IS_GROUP: 0,
		STATUS_MSG: 'Keep Collecting',
		IS_REGIS: 1,
		IS_GROUP_ADMIN: 0,
		IS_INVITED: null,
		IS_BLOCKED: 0,
		IS_PHONEBOOK_CONTACT: 0,
		UNREAD_COUNT: 999,
		SMALL_IMAGE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAG0mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTgtMTAtMjNUMTU6MTk6NDMrMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTAxVDIxOjA2OjQ1KzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTAxVDIxOjA2OjQ1KzA1OjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmYzZjg2ZTIyLWQ2ODAtNGQzNi05MjM3LWUzNmYxMTQzMWZiMyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjcxNmFiZDc5LTc0NDQtMjA0OC1hZDZlLTYzMThmOTc0N2NkYiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmFmNDMxMzJjLTMzOTMtNDU2NS04NWZkLWQ2M2Y4Njg2N2FjOCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWY0MzEzMmMtMzM5My00NTY1LTg1ZmQtZDYzZjg2ODY3YWM4IiBzdEV2dDp3aGVuPSIyMDE4LTEwLTIzVDE1OjE5OjQzKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDA3M2Q3YmItNjMzMy00ZTgwLWEwNjAtYWQ5YzVlZTVkNGQ4IiBzdEV2dDp3aGVuPSIyMDE5LTEwLTAxVDIxOjA0OjQyKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjNmODZlMjItZDY4MC00ZDM2LTkyMzctZTM2ZjExNDMxZmIzIiBzdEV2dDp3aGVuPSIyMDE5LTEwLTAxVDIxOjA2OjQ1KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBl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',
		IMAGE_PATH: 'https://parthaprofiles.s3.ap-south-1.amazonaws.com/9005835708_pic.png',
		LAST_MSG_CREATED_TIME: '1578758539267',
		MSG_TYPE: 1,
		MSG_TEXT: 'Hello World'
	},
	{
		_ID: 3,
		JEWELCHAT_ID: 3,
		JID: '919905835708@jewelchat.net',
		CONTACT_NUMBER: 919905835709,
		CONTACT_NAME: 'Mayukh',
		PHONEBOOK_CONTACT_NAME: '919005835709',
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
		MSG_TEXT: 'Hello World Hello World Hello World Hello World Hello World '
	}]

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