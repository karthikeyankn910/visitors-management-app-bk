const express = require('express');
const dotEnv = require('dotenv').config();
const { sequelize } = require('./db_conn/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const branchRoute = require('./routes/branchRoute');
const employeeRoute = require('./routes/employeeRoute');
const visitorRoute = require('./routes/visitorRoute');
const rateLimit = require('express-rate-limit');
const cluster = require('cluster');
const process = require('process');
const os = require('os');
const cron = require('node-cron'); 
const sgMail = require('@sendgrid/mail');
const { sendMail, setEmailBody } = require('./mail_config/emailSend');
const { tempVisitors } = require('./temp_store/temporaryStore');



//initializing express
const app = express();


//initializing rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: "Too many request from this IP address", 
    statusCode: 429,
    skipSuccessfulRequests: true,
});


//middleware for rate limitation
app.use(limiter);


//middlewares for bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//middleware for cors policy
app.use(cors({ origin: "http://localhost:3000"}));


//database authentication
sequelize.authenticate()
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.log("DB connection error");
    });
sequelize.sync({}); 


//sample GET request for cluster and testing....ignore it
app.get('/', (req, res) => {
    res.send(`Yes it's working by ${process.pid}`);
    cluster.worker.kill();
});


//middlewares for each models 
app.use('/api/v1/branches', branchRoute); 
app.use('/api/v1/employees', employeeRoute);
app.use('/api/v1/visitors', visitorRoute);

 

//get number of cpu cores in our machine
const numCpus = os.cpus().length;  


//if mastser cluster then create worker instances
// if (cluster.isMaster) { 
//     for (let i = 0; i < numCpus; i++) { 
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} is killed`);
//         cluster.fork();
//     });
// }
// else{ 
    app.listen(process.env.PORT, () => {
        console.log("Server", process.pid, "listening at " + process.env.PORT);
    }); 
// }

 


//set api key for sgMail
sgMail.setApiKey(process.env.SG_API_KEY); 
 
 


// scheduling cron job for email send 
// 0 21 */1 * 1-5
cron.schedule('*/20 * * * * *', async () => { 
    console.log("+++++++++++++++++++++++++++CRON+++++++++++++++++++++++++++++++++"); 
    await setEmailBody("sample check", tempVisitors); 
    let n = tempVisitors.length;
    for (let i = 0; i < n; i++) {
        tempVisitors.pop();
    }
});


 