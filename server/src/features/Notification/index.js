import {androidNotification} from './android';
import logger from '../../services/logger';

const notification = async (req,res) => {
    let response = {
        status : 0,
        message : "issue in notification"
    }
    
    try {
        let {titel,body} = req.body;

        let notificationResp = await androidNotification(titel,body)
        if(notificationResp){
            response.status = 1;
            response.message = notificationResp
        }

        return res.json(response);
    } catch (err) {
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

    }
}

module.exports = {notification}