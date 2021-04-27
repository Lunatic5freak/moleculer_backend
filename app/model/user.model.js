module.exports=(mongoose)=>{
    var schema=mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:"user"
        },
        subscribed_plans:{
            type:String,
            default:'free'
        },
        token:{
            type:String
        }
    },{timestamps:true});
    schema.index({name:"text",email:"text"})
    var User=mongoose.model("User",schema);
    return User;
}