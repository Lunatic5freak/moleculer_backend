const db=require('./../model/index')
const Plan=db.plans;
const Db=require('moleculer-db')
const Mongooseadapter=require('moleculer-db-adapter-mongoose');
const jwt = require('jsonwebtoken');
const dburl=require('./../config/db.config')
require('dotenv').config()

module.exports={
    name:"plans",
    mixins:[Db],
    adapter:new Mongooseadapter(dburl.url,{
        keepAlive:true
    }),
    model:db.plans,
    actions:{
        create:{
            rest:"POST /",
            async handler(req){
              let cookie=await jwt.verify(req.meta.token,process.env.SECRET_KEY);
              if(cookie.role==='admin'){
                let plan=new Plan({
                    name:req.params.name,
                    price:req.params.price,
                    validity:req.params.validity
                })
                const plan1=await plan.save();
                return plan1;
              }else{
                  return({msg:'unauthorized'})
              }
            }
        },
        update:{
            rest:"PUT /:id",
            async handler(req){
                let cookie=await jwt.verify(req.meta.token,"supersecret");
                if(cookie.role==='admin'){
                    let id={_id:req.params.id}
                    const plan=await Plan.findOneAndUpdate(id,req.params,{ useFindAndModify: false });
                    return plan;
                }else{
                    return({msg:'unauthorized'})
                }

            }
        },
        delete:{
            rest:"DELETE /:id",
            async handler(req){
                let cookie=await jwt.verify(req.meta.token,"supersecret");
                if(cookie.role==='admin'){
                    let msg={msg:'deleted'}
                    await Plan.findByIdAndRemove({_id:req.params.id});
                    return msg;
                }else{
                    return ({msg:'authorized'})
                }
                
            }
        },
        findAll:{
            rest:"GET /",
            async handler(req){
                const plans=await Plan.find({});
                return plans
            }
        }
    }
}