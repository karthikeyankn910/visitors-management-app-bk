 
const branchService = require('../services/branchService');
const employeeService = require('../services/employeeService');
const visitorService = require('../services/visitorService');
const downloadResource = require('./packAndSendData');
const { branchFields, employeeFields, visitorFields } = require('./allModelFields');





const download = async (req, res, modelName) => {  
    if (modelName === 'branch') { 
        fields = branchFields;
        data = await branchService.getAllBranches();
        fileName = 'branch.csv';
    }
    else if (modelName === 'visitor') { 
        fields = visitorFields;
        data = await visitorService.getAllVisitors();
        fileName = 'visitor.csv';
    }
    else { 
        fields = employeeFields;
        data = await employeeService.getAllEmployees();
        fileName = 'employee.csv';
    } 
    return downloadResource(res, fileName, fields, data);  
}



module.exports = download;