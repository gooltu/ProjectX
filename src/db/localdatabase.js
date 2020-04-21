import SQLite from 'react-native-sqlite-storage';
import SQL from './queries';


SQLite.DEBUG(true);
SQLite.enablePromise(true);

let _jcdb

export default {  
  getChats
};


SQLite.openDatabase({
    name: 'jewelchat.db',
    version: '1.0'
}).then( instance => {
    _jcdb = instance;
    console.log('APP START DATABASE CONNECTION SUCCESSFUL');
    console.log( _jcdb )
    return _jcdb.transaction((txn) => {             

        let queries = [];

        let q = txn.executeSql(SQL.Create_Contact);
        queries.push(q);                                   

        q = txn.executeSql(SQL.Create_ChatMessage);
        queries.push(q);       

        return Promise.all(queries);      

    })

}).then( val => {
  console.log('APP START CREATE TABLES PROMISE SUCCESSFUL')
  console.log(val)
}).then((result) =>{             
  console.log('APP START TRANSACTION SUCCESSFUL')    
}).catch(err => {
  console.log('APP START DATABASE ERROR');
  console.log(err);
  //kill app
});


const _initDb = function(){

  return new Promise((resolve, reject) => {

      if(_jcdb)
        resolve(_jcdb);
      else{
          SQLite.openDatabase({
            name: 'jewelchat.db',
            version: '1.0'
          }).then( instance => {
            _jcdb = instance;
            resolve(_jcdb);
          }).catch(err => {
            reject(err);
          })
      }  

  })

}


const getChats = function(){

  return new Promise( (resolve, reject) => {

      _initDb().then( instance => {
          jcdb = instance;          
          return jcdb.transaction((txn) => {             
      
              
      
              txn.executeSql('Select * from ChatMessage', [])
              .then( (txn, results) => {
                console.log('QUERY COMPLETED');
                resolve(results)
              })
              .catch( err => {
                reject(err)
              })
              
              
      
          })
      
      }).then( result => {
        
      }).catch(err => {

        reject(err)
        
      })



  });

}





   


/*

export const insertInitialData = () => {
  console.log('INSERT ROWS START');
  return (dispatch, getState) => {
    console.log('INSERT ROWS');
      if(jcdb){

          jcdb.transaction((txn) => {
              

              let queries = [];

              let sql; 
              sql = "INSERT INTO Contact " + 
              " ( JEWELCHAT_ID, JID, CONTACT_NUMBER, CONTACT_NAME, STATUS_MSG, IS_REGIS, IS_INVITED, IS_PHONEBOOK_CONTACT, UNREAD_COUNT ) " + 
              " VALUES ( 1, '910000000000@jewelchat.net', '910000000000', 'Team JewelChat', 'Collect and Win', 1, 1, 0, 1 )";
              let q = txn.executeSql(sql);
              queries.push(q);                         


              sql = "INSERT INTO ChatMessage " +
              " ( MSG_TYPE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, SENDER_NAME, SENDER_MSG_ID, JEWEL_TYPE, MSG_TEXT ) " +
              " VALUES ( 1, 1569819057204, '910000000000@jewelchat.net', '910000000000@jewelchat.net', 'Team Jewelchat', '1', '3', 'Hello World' ) ";
              q = txn.executeSql(sql);
              queries.push(q);

              sql = "INSERT INTO ChatMessage " +
              " ( MSG_TYPE, CREATED_TIME, CHAT_ROOM_JID, CREATOR_JID, SENDER_NAME, SENDER_MSG_ID, JEWEL_TYPE, MSG_TEXT ) " +
              " VALUES ( 1, 1569819266669, '910000000000@jewelchat.net', '910000000000@jewelchat.net', 'Team Jewelchat', '2', '6', 'How are you?' ) ";
              q = txn.executeSql(sql);
              queries.push(q);

              Promise.all(queries).then( val => {
                  console.log('INSERT DATA PROMISE ALL')
                  console.log(val)                  
              }).catch( err => {                                           
                  throw err;
              })
            

          }).then((result) =>{  
            console.log('Result:'+ result);                  
          }).catch((err) => {
              throw err;
          })

      }

  }    

}



export default {
  jcdb,
  openDatabaseConnection,
  createDatabaseTables
}

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