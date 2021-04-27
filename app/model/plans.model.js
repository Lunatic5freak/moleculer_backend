module.exports=(mongoose)=>{
    var schema=mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        validity:{
            type:Number,
            required:true
        }
    },{timestamps:true});
    const Plan=mongoose.model('Plan',schema);
    return Plan;
}