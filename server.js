const Moleculer=require('moleculer')
const ApiGatewayService=require('moleculer-web')
const path=require('path')
const cookies=require('cookies')

const broker=new Moleculer.ServiceBroker({
    logger:console,
    port:7070,
    keepAlive:true

});

broker.loadService(path.join(__dirname,"./app/services/user.service.js"))
broker.loadService(path.join(__dirname,"./app/services/plans.service.js"))
broker.loadService(path.join(__dirname,"./app/services/auth.service.js"))

// broker.createService({
//     name:"user",
    

// })
// broker.createService(ApiGatewayService,{keepAlive:true});

broker.createService({
    mixins:[ApiGatewayService],
    settings:{
        port:process.env.PORT ||7070,
        // cors:{
        //     origin: "http://127.0.0.1:3001",
        //     // Configures the Access-Control-Allow-Methods CORS header. 
        //     methods: ["GET","OPTIONS", "POST", "PUT", "DELETE"],
        //     // Configures the Access-Control-Allow-Headers CORS header.
        //     allowedHeaders: ["access-control-allow-credentials",
        //     "access-control-allow-headers",
        //     "access-control-allow-methods",
        //    " access-control-allow-origin",
        //     "access-control-expose-headers",
        //     "connection",
        //     "content-length",
        //     "content-type",
        //    " date",
        //     "keep-alive",
        //     "vary",
        //    " x-request-id",
        //    "set-Cookie"],
        //     // Configures the Access-Control-Expose-Headers CORS header.
        //     exposedHeaders:"*",
        //     // Configures the Access-Control-Allow-Credentials CORS header.
        //     withCredentials:true,
        // },
        routes:[
            {
                path:'/user',
                onAfterCall(ctx,route,req,res,data){
                    res.cookies=new cookies(req,res);
                    console.log('ctx meta toke='+ctx.meta.token);
                    res.cookies.set('token',ctx.meta.token)
                    return data
                },
                aliases:{
                    "POST login":"auth.login"
                }
            },
            {
                path:'/api',
                onBeforeCall(ctx,route,req,res){
                    res.cookies=new cookies(req,res);
                    ctx.meta.token=res.cookies.get('token')
                },
                onAfterCall(ctx,route,req,res,data){
                    res.cookies=new cookies(req,res);
                    if(ctx.meta.token)
                    res.cookies.set('token',ctx.meta.token)
                    return data
                },
            
                aliases:{
                    "POST users/":"users.create",
                    "PUT users/:id":"users.update",
                    "DELETE users/:id":"users.delete",
                    "GET users/:id":"users.findOne",
                    "GET users/":"users.findAll",
                    "POST plans/":"plans.create",
                    "PUT plans/:id":"plans.update",
                    "DELETE plans/:id":"plans.delete",
                    "GET plans/":"plans.findAll",
                    // "POST api/login":"auth.login"
                }
            },
            {
               path:'/api/logout',
               onBeforeCall(ctx,route,req,res){
                res.cookies=new cookies(req,res);
                ctx.meta.token=res.cookies.get('token')
            },
               onAfterCall(ctx,route,req,res,data){
                   console.log(ctx.meta.token);
                   res.cookies.set('token',ctx.meta.token)
                   return data;
               },
               aliases:{
                "GET /":"auth.logout"
               }
            }
            
        ],
    },
})


broker.start()
.then(()=>{
    console.log('server started');
})