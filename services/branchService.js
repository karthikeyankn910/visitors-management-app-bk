const { Branch } = require('../db_conn/db');

//create new branch
module.exports.createBranch = (branch) => { 
    return Branch.create({
        id: branch.id,
        name: branch.name,
        city: branch.city
    }).then(branch => {
        return branch;
    }).catch(err => {
        return err;
    });
}

//get all branches
module.exports.getAllBranches = () => {
    return Branch.findAll()
            .then(allBranches => {
                return allBranches;
            })
            .catch(err => {
                return err;
            });
}

//get branch by id
module.exports.getBranchById = (branch_id) => {
    return Branch.findOne({
        where: {
            id: branch_id
        }
    }).then(branch => {
        return branch;
    }).catch(err => {
        return err;
    });
}

//update a branch
module.exports.updateBranch = (branch) => {
    return Branch.update(branch, {
        where: {
            id: branch.id
        },
        returning: true, 
        plain: true
    }).then(branch => {
        return branch;
    }).catch(err => {
        return err;
    })
}

//delete a branch
module.exports.deleteBranch = (branch_id) => {
    return Branch.findOne({
        where: {
            id: branch_id
        }
    }).then(branch => {
       branch.destroy();
       return branch;
    }).catch(err => {
        return err;
    });
}