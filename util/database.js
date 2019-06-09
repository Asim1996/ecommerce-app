// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456'
// });

// module.exports = pool.promise();

// const Sequelize=require('sequelize');
// const sequelize=new Sequelize('node-complete','root','123456',{
//     dialect:'mysql',
//     host:'localhost'

// });
// module.exports=sequelize;

const MongoClient = require('mongodb').MongoClient;
let _db;
const mongoConnect = callback => {
MongoClient.connect("mongodb://localhost:27017/ecommerce")
.then(client=>{
    console.log('Connected!');
    _db=client.db();//connects to the default database i.e. ecommerce
                    //can me changed by passing args
    callback();
})
.catch(err=>{
    console.log(err);
    throw err;
})
};

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!-'
}
module.exports=mongoConnect;