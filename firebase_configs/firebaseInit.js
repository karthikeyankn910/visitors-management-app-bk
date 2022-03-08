const admin = require("firebase-admin");
const serviceAccount = require('../conf/firebasePrivatekey.json');


module.exports = function() {
    admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://fcm-visitors-management-default-rtdb.firebaseio.com/"
    });
}
