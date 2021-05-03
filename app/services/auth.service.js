const db=require('./../model/index')
const User=db.users;
const Db=require('moleculer-db')
const Mongooseadapter=require('moleculer-db-adapter-mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports={
    name:"auth",
    actions:{
        login:{
            rest:"POST /",
            async handler(ctx){
                const userid=ctx.params.userid
                const password=ctx.params.password
                console.log(userid)
                console.log(password)
                const user=await User.findOne({email:userid});
                if(user){
                    let match=await bcrypt.compare(password,user.password);
                    if(match){
                        let token=jwt.sign({email:user.email,role:user.role},process.env.SECRET_KEY);
                        ctx.meta.token=token
                        await User.update({_id:user._id},{$set:{token:token}})
                        let user1={email:user.email,role:user.role};
                        // ctx.meta.$responseHeaders={
                        //     "Set-Cookie":token
                        // }
                        return user1
                    }else{
                        let msg={msg:"wrong password"}
                        return msg;
                    }
                }else{
                    let msg={msg:"invalid credentials"}
                    return msg;
                }
            }
        },
        logout:{
            rest:"GET /",
            async handler(req){
                const token=await jwt.verify(req.meta.token,process.env.SECRET_KEY);
                const user=await User.findOneAndUpdate({email:token.email},{$set:{token:'null'}});
                
                return({msg:"logged out succesfully"})
            }
        }
    }

}