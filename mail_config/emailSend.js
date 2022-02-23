const sgMail = require('@sendgrid/mail');
const { visitorFields } = require('../export_logic/allModelFields');
const { Parser } = require('json2csv');
const { tempVisitors } = require('../temp_store/temporaryStore')


module.exports.sendMail = function sendMail(message) {   
    sgMail.send(message)
        .then(response => {
            console.log("Email sent....");
            return;
        })
        .catch(err => {
            console.log("Error occured: ", err.message);
            return;
        });
}

module.exports.setEmailBody = async function setEmailBody(sub, data) { 
    let fields = visitorFields;
    const json2csv = new Parser({ fields });
    const csv = await json2csv.parse(data);
    const message =  {
        to: ['karthikeyankn910@gmail.com', 'karthikeyan9102001@gmail.com'],
        from: {
            name: 'karthikeyan',
            email: 'karthikeyan9102001@gmail.com',
        },
        subject: sub,
        text: csv, 
    };  
    console.log(csv);  
    tempVisitors = [];
    return message;
}