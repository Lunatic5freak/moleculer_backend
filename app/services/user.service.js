const db=require('./../model/index')
const User=db.users;
const Db=require('moleculer-db')
const Mongooseadapter=require('moleculer-db-adapter-mongoose')
const _=require('lodash')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dburl=require('./../config/db.config')
require('dotenv').config()
console.log(dburl.url);
module.exports={
    name:"users",
    //mongodb+srv:livingdead:lucky7538@cluster0.baxgw.mongodb.net/test
    mixins:[Db],
    adapter:new Mongooseadapter(dburl.url,{
        keepAlive:true
    }),
    model:db.users,
    actions:{
        create:{
            rest:"POST /",
            async handler(req){
                console.log('inside service');
                const password=await bcrypt.hash(req.params.password,10)
                var user=new User({
                    name:req.params.name,
                    email:req.params.email,
                    password:password
                })
                const user1=await user.save();
                return user1;
            }
        },
        update:{
            rest:"PUT /:id",
            async handler(req){
                let cookie=await jwt.verify(req.meta.token,"supersecret")
                const user=await User.findOne({email:cookie.email})
                if(user.token===req.meta.token && cookie.role=='user'){
                    let id={_id:user._id}
                    await User.findOneAndUpdate(id,req.params);
                    let msg={msg:'update successfully'}
                    return msg
                }
            }
        },
        delete:{
            rest:"DELTE /:id",
            async handler(req){
                let cookie=await jwt.verify(req.meta.token,"supersecret")
                const user=await User.findOne({email:cookie.email})
                if(user.token===req.meta.token && cookie.role=='admin'){
                    let id={_id:user._id}
                    await User.findOneAndRemove(id);
                    let msg={msg:'deleted successfully'}
                    return msg
                }else{
                    let msg={msg:'unauthorized'}
                    return msg;
                }
            }
        },
        findOne:{
            rest:"GET /:id",
            async handler(req){
                console.log(req.meta.token)
                console.log(req.params.id)
                let cookie=await jwt.verify(req.meta.token,"supersecret");
                if(cookie.email===req.params.id){
                    const user=await User.findOne({email:req.params.id})
                    return user;
                }else{
                    return({msg:"authentication failure"})
                }
            }
        },
        findAll:{
            rest:"GET /",
            async handler(req){
                let cookie=await jwt.verify(req.meta.token,"supersecret");
                if(cookie.role==='admin'){
                   if(req.params.keyword!=null){
                    const user=await User.find({$text:{$search:req.params.keyword}});
                    return user;
                   }else{
                    const users=await User.find({})
                    return users
                   }
                }else{
                    return ({msg:"unauthorized"})
                }
            }
        }
    }
}