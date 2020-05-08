require('dotenv').config();
var admin = require("firebase-admin");

var serviceAccount = require("../stackoverflowclone-5278a-firebase-adminsdk-u4huw-5ebee44d01.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class NotificationServer{

    static  sendPushToUser(topic, message){
        return admin.messaging().sendToTopic(topic, message);
    }

    static subscribeToQuestion(token, topic){
        return admin.messaging().subscribeToTopic(token, topic)
    }
}
module.exports = NotificationServer;