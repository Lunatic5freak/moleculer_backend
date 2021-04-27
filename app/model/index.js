const mongoose=require('mongoose');
const dbconfig=require('../config/db.config')

const db={}
db.url=dbconfig.url;
db.users=require('./user.model')(mongoose);
db.plans=require('./plans.model')(mongoose);
module.exports=db;
