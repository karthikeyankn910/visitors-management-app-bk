const { Parser } = require('json2csv');


module.exports = downloadResource = (res, fileName, fields, data) => {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-type', 'text/csv');
    res.attachment(fileName);  
    return res.send(csv);  
     
}