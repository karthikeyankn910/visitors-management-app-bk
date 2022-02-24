const sgMail = require('@sendgrid/mail');  
const pug = require('pug');


function sendMail(message) {    
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

// module.exports.setEmailBody = function setEmailBody(sub, data) { 
//     let htmlTemplate;
//     if (data.length > 0) { 
//         htmlTemplate = `<table border=1 cellspacing=0 cellpadding=5>
//         <tr>
//             <th>Visitorid</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Designation</th>
//             <th>Purpose</th>
//             <th>Organization</th>
//             <th>City</th>
//             <th>Check-in</th>
//             <th>Check-out</th>
//             <th>Other-info</th> 
//         </tr> 
//         `;
//         data.forEach(d => {
//             htmlTemplate += `<tr>
//             <td>${d.dataValues.id}</td>
//             <td>${d.dataValues.name}</td> 
//             <td>${d.dataValues.email}</td> 
//             <td>${d.dataValues.phone}</td> 
//             <td>${d.dataValues.designation}</td> 
//             <td>${d.dataValues.purpose}</td> 
//             <td>${d.dataValues.organization}</td> 
//             <td>${d.dataValues.city}</td>
//             <td>${d.dataValues.check_in}</td> 
//             <td>${d.dataValues.check_out}</td>`;
//             let otherInfo = d.dataValues.other_info;
//             let temp = "";
//             for (let key in otherInfo) {
//                 temp += key + ":" + otherInfo[key] + "; ";
//             }
//             htmlTemplate += `<td>${temp}</td></tr>`;
//         });
//         htmlTemplate += `</table>`;
//     } else {
//         htmlTemplate = "<div>There are no new visitors here...!!!</div>"
//     }

//     const message =  {
//         to: ['karthikeyankn910@gmail.com', 'karthikeyan9102001@gmail.com'],
//         from: {
//             name: 'karthikeyan',
//             email: 'karthikeyan9102001@gmail.com',
//         },
//         subject: "Visitor's report",
//         html: htmlTemplate,
//         text: "Here the visitors report"
//     };     
 
//     console.log(data.length);  
//     sendMail(message); 
// }




module.exports.setEmailBody = function setEmailBody(sub, data) {  
    console.log("a");
    const htmls = pug.renderFile(__dirname+"/"+'template.pug', {data: data}); 
    console.log("b");
    const message =  {
        to: ['karthikeyankn910@gmail.com', 'karthikeyan9102001@gmail.com'],
        from: {
            name: 'karthikeyan',
            email: 'karthikeyan9102001@gmail.com',
        },
        subject: "Visitor's report",
        html: htmls, 
    };     

    console.log(__dirname);
  
    sendMail(message); 
}