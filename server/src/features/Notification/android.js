// import { Router } from 'express';
import FCM from 'fcm-node';
import User from '../User/user'

const androidNotification = async (title,body) => {
    let response = {
        status: 0,
        message: 'Issue in notification'    
    }
    try {
        let deviceToken = await User.findById({},{deviceToken:1})
        let serverKey = '';

        let fcm = new FCM(serverKey);
        let message = {
            to: deviceToken.deviceToken,
            notification: {
                title: title,
                body: body
            },
        };

        fcm.send(message, (err, response) => {
            if (response) {
                response.status = 1;
                response. message = "Successfully sent with response";
            }else{
                response.message = err
            }
            return response;
        });
    } catch (err) {
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;
    }
}

module.exports = { androidNotification }