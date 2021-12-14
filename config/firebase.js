const admin = require("firebase-admin");
var serviceAccount = require('../adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aurtistic-5f39f-default-rtdb.firebaseio.com"
});

module.exports = admin;